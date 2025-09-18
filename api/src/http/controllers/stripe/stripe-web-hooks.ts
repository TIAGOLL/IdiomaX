import { type FastifyInstance } from 'fastify';
import { stripe } from '../../../lib/stripe';
import Stripe from 'stripe';
import { env } from '../../server';
import { prisma } from '../../../lib/prisma';
import { NotFoundError } from '../_errors/not-found-error';

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
                    const data = await prisma.stripePrice.findFirst({
                        where: {
                            unit_amount: price.unit_amount,
                            active: true,
                        },
                        select: {
                            id: true,
                        },
                    });

                    const priceData = {
                        id: data?.id ?? price.id,
                        product_id: price.product as string,
                        active: price.active,
                        currency: price.currency,
                        description: price.nickname ?? undefined,
                        type: price.type,
                        unit_amount: price.unit_amount ?? undefined,
                        interval: price.recurring?.interval,
                        interval_count: price.recurring?.interval_count,
                        trial_period_days: price.recurring?.trial_period_days,
                        metadata: price.metadata,
                    };

                    await prisma.stripePrice.upsert({
                        where: { id: priceData.id },
                        create: priceData,
                        update: priceData,
                    });
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
                    const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);
                    const subscription = (subscriptionResponse as any).data ?? subscriptionResponse;

                    const { company_id } = await prisma.stripeCompanyCustomer.findFirst({
                        where: { stripe_customer_id: customerId },
                        select: { company_id: true },
                    });
                    if (!company_id) {
                        throw new NotFoundError('Customer not found');
                    }

                    await prisma.stripeCompanySubscription.upsert({
                        where: { company_customer_id: String(company_id) },
                        create: {
                            id: String(subscription.id),
                            status: subscription.status,
                            metadata: subscription.metadata,
                            quantity: subscription.items.data[0].quantity ? Number(subscription.items.data[0].quantity) : null,
                            cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
                            current_period_start: convertDate(subscription.current_period_start) ?? new Date(),
                            current_period_end: convertDate(subscription.current_period_end) ?? new Date(),
                            ended_at: convertDate(subscription.ended_at),
                            cancel_at: convertDate(subscription.cancel_at),
                            canceled_at: convertDate(subscription.canceled_at),
                            trial_start: convertDate(subscription.trial_start),
                            trial_end: convertDate(subscription.trial_end),
                            price: {
                                connect: { id: String(subscription.items.data[0].price.id) }
                            },
                            company_customer: {
                                connect: { company_id: company_id }
                            }
                        },
                        update: {
                            id: String(subscription.id),
                            status: subscription.status,
                            metadata: subscription.metadata,
                            price_id: String(subscription.items.data[0].price.id),
                            quantity: subscription.items.data[0].quantity ? Number(subscription.items.data[0].quantity) : null,
                            cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
                            current_period_start: convertDate(subscription.current_period_start) ?? new Date(),
                            current_period_end: convertDate(subscription.current_period_end) ?? new Date(),
                            ended_at: convertDate(subscription.ended_at),
                            cancel_at: convertDate(subscription.cancel_at),
                            canceled_at: convertDate(subscription.canceled_at),
                            trial_start: convertDate(subscription.trial_start),
                            trial_end: convertDate(subscription.trial_end),
                        },
                    });
                }

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
                            case 'product.updated':
                                await upsertProductRecord(receivedEvent?.data?.object as Stripe.Product);
                                break;
                            case 'price.created':
                            case 'price.updated':
                                await upsertPriceRecord(receivedEvent?.data?.object as Stripe.Price);
                                break;
                            case 'customer.subscription.created':
                            case 'customer.subscription.deleted':
                            case 'customer.subscription.updated':
                                await subscriptionStatusChangedEvent(receivedEvent);
                                break;
                            case 'checkout.session.completed':
                                await checkoutSessionCompletedEvent(receivedEvent);
                                break;
                            default:
                                throw new Error('Unhandled relevant event!');
                        }
                    } catch (error) {
                        console.error(`Error:`, error);
                    }
                }

                reply.status(200).send({});
            }
        )
}
