import fastify, { type FastifyInstance } from 'fastify';
import { stripe } from '../../../lib/stripe';
import Stripe from 'stripe';
import { env } from '../../server';
import { prisma } from '../../../lib/prisma';
import { NotFoundError } from '../_errors/not-found-error';

interface iPriceData {
    id: string;
    product_id: string;
    active: boolean;
    currency: string;
    description?: string | null;
    type: string;
    unit_amount: number;
    interval: string;
    interval_count: number;
    trial_period_days?: number | null;
    metadata: unknown;
}

interface iSubscriptionData {
    id: string;
    company_id: string;
    status: string;
    metadata: unknown;
    price_id: string;
    quantity: number;
    cancel_at_period_end: boolean;
    current_period_start: Date | null;
    current_period_end: Date | null;
    ended_at: Date | null;
    cancel_at: Date | null;
    canceled_at: Date | null;
    trial_start: Date | null;
    trial_end: Date | null;
}

export async function StripeWebHooks(app: FastifyInstance) {

    app.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body, done) {
        done(null, body);
    });

    app
        .post(
            '/stripe/webhooks',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Obter dados dos eventos do Stripe',
                    security: [{ bearerAuth: [] }],
                },
            },
            async (request, reply) => {
                const relevantEvents = new Set([
                    'product.created',
                    'product.updated',
                    'price.created',
                    'price.updated',
                    'checkout.session.completed',
                    'customer.subscription.created',
                    'customer.subscription.updated',
                    'customer.subscription.deleted',
                ]);

                const upsertProductRecord = async (product: Stripe.Product) => {
                    const productData = {
                        id: product.id,
                        active: product.active,
                        name: product.name,
                        description: product.description,
                        metadata: product.metadata,
                    }
                    await prisma.stripeProduct.upsert({ where: { id: product.id }, create: productData, update: productData }).catch((error) => {
                        console.error('Error upserting product:', error);
                    });
                }

                const upsertPriceRecord = async (price: Stripe.Price) => {
                    const priceData: Partial<iPriceData> = {
                        id: price.id,
                        active: price.active,
                        currency: price.currency,
                        description: price.nickname ?? undefined,
                        type: price.type,
                        unit_amount: price.unit_amount ?? undefined,
                        interval: price.recurring?.interval,
                        interval_count: price.recurring?.interval_count,
                        trial_period_days: price.recurring?.trial_period_days,
                        metadata: price.metadata,
                    }

                    const data = await prisma.stripePrice.findFirst({
                        where: {
                            unit_amount: priceData.unit_amount,
                            active: true,
                        },
                        select: {
                            id: true,
                        },
                    });

                    if (data?.id) { priceData.id = data.id; }
                    if (price.product) priceData.product_id = price.product as string;

                    await prisma.stripePrice.upsert({ where: { id: priceData.id }, create: priceData, update: priceData });
                }

                const subscriptionStatusChangedEvent = async (event: Stripe.Event) => {
                    const subscription = event.data.object as Stripe.Subscription;
                    const customerId = subscription.customer as string;
                    const subscriptionId = subscription.id;

                    await manageSubscriptionStatusChange(
                        subscriptionId,
                        customerId,
                    );
                }
                const checkoutSessionCompletedEvent = async (event: Stripe.Event) => {
                    const session = event.data.object as Stripe.Checkout.Session;
                    if (session.mode !== 'subscription') return
                    const customerId = session.customer as string;
                    const subscriptionId = session.subscription as string;

                    await manageSubscriptionStatusChange(subscriptionId, customerId);
                }

                const convertDate = (date: number | null) => (date ? new Date(date * 1000) : null);

                const manageSubscriptionStatusChange = async (subscriptionId: string, customerId: string) => {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

                    const customerData = await prisma.stripeCompanyCustomer.findUnique({ where: { stripe_customer_id: customerId }, select: { company_id: true }, });
                    if (!customerData) {
                        throw new NotFoundError('Customer not found');
                    }

                    const { company_id } = customerData

                    const subscriptionData: Partial<iSubscriptionData> = {
                        id: subscription.id,
                        company_id,
                        status: subscription.status,
                        metadata: subscription.metadata,
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        current_period_start: convertDate(subscription.current_period_start),
                        current_period_end: convertDate(subscription.current_period_end),
                        ended_at: convertDate(subscription.ended_at),
                        cancel_at: convertDate(subscription.cancel_at),
                        canceled_at: convertDate(subscription.canceled_at),
                        trial_start: convertDate(subscription.trial_start),
                        trial_end: convertDate(subscription.trial_end),
                    }

                    // Upsert da assinatura
                    await prisma.stripeCompanySubscription.upsert({
                        where: { id: subscription.id },
                        create: subscriptionData,
                        update: subscriptionData,
                    });
                }

                // Use SEMPRE request.rawBody como buffer:
                const signature = request.headers['stripe-signature'];
                const webhookSecret = env.data.STRIPE_WEBHOOK_SECRET;
                let receivedEvent: Stripe.Event;
                try {
                    receivedEvent = stripe.webhooks.constructEvent(
                        request.body as Buffer,
                        signature,
                        webhookSecret
                    );
                } catch (error) {
                    console.error('Error verifying webhook signature:', error);
                    return reply.status(400).send({ error: error.message });
                }

                if (relevantEvents.has(receivedEvent.type)) {
                    try {
                        switch (receivedEvent.type) {
                            case 'product.created':
                                await upsertProductRecord(receivedEvent?.data?.object as Stripe.Product);
                                break;
                            case 'product.updated':
                                await upsertProductRecord(receivedEvent?.data?.object as Stripe.Product);
                                break;
                            case 'price.created':
                                await upsertPriceRecord(receivedEvent?.data?.object as Stripe.Price);
                                break;
                            case 'price.updated':
                                await upsertPriceRecord(receivedEvent?.data?.object as Stripe.Price);
                                break;
                            case 'checkout.session.completed':
                                await checkoutSessionCompletedEvent(receivedEvent);
                                break;
                            case 'customer.subscription.created':
                                break;
                            case 'customer.subscription.deleted':
                                break;
                            case 'customer.subscription.updated':
                                await subscriptionStatusChangedEvent(receivedEvent);
                                break;
                            default:
                        }
                    } catch (error) {
                        console.error(`Error:`, error);
                    }
                }

                reply.status(200).send({});
            }
        )
}
