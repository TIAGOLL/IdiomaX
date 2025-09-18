import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { stripe } from '../../../lib/stripe';
import { createSubscriptionRequest, createSubscriptionResponse } from '@idiomax/http-schemas/create-subscription'
import { prisma } from '../../../lib/prisma';

export async function CreateSubscription(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/stripe/create-subscription',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Criar uma nova assinatura Stripe',
                    security: [{ bearerAuth: [] }],
                    response: {
                        201: createSubscriptionResponse,
                    },
                    body: createSubscriptionRequest
                },
            },
            async (request, reply) => {

                const { priceId, companyId } = request.body;
                const userId = await request.getCurrentUserId();

                const { email, name, phone } = await prisma.users.findUnique({
                    where: { id: userId },
                    select: { email: true, name: true, phone: true }
                });
                await prisma.$transaction(async (prisma) => {
                    const { id: stripeCustomerId } = await stripe.customers.create({
                        email,
                        name,
                        phone,
                    });

                    const { stripe_customer_id } = await prisma.stripeCompanyCustomer.upsert({
                        where: { company_id: companyId },
                        update: { stripe_customer_id: stripeCustomerId },
                        create: { company_id: companyId, stripe_customer_id: stripeCustomerId }
                    })

                    const customerSubscriptions = await stripe.subscriptions.list({
                        customer: stripe_customer_id,
                    });

                    const activeSubscriptions = customerSubscriptions.data.filter((subscription: { status: string }) => subscription.status === 'active');
                    if (activeSubscriptions.length > 0) throw new Error('Cliente já possui uma ou mais assinaturas ativas');

                    const { id: subscriptionId } = await stripe.subscriptions.create({
                        customer: stripe_customer_id,
                        items: [{ price: priceId }],
                        trial_period_days: 14,
                    });

                    await prisma.stripeCompanySubscription.upsert({
                        where: { company_customer_id: companyId },
                        update: {
                            status: 'trialing',
                        },
                        create: {
                            id: subscriptionId,
                            price_id: priceId,
                            company_customer_id: companyId,
                            status: 'trialing',
                        }
                    })
                })

                reply.status(201).send({ message: "Assinatura criada com sucesso!" });
            })
}
