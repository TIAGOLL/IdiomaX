import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { stripe } from '../../../lib/stripe';
import { CreateSubscriptionApiRequestSchema, CreateSubscriptionApiResponseSchema } from '@idiomax/validation-schemas/subscriptions/create-subscription'
import { prisma } from '../../../lib/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

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
                        201: CreateSubscriptionApiResponseSchema,
                    },
                    body: CreateSubscriptionApiRequestSchema
                },
            },
            async (request, reply) => {

                const { price_id, company_id } = request.body;
                const userId = await request.getCurrentUserId();
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('create-subscription', 'Company')) {
                    throw new ForbiddenError()
                }

                const userData = await prisma.users.findUnique({
                    where: { id: userId },
                    select: { email: true, name: true, phone: true }
                });

                if (!userData) {
                    throw new Error('Usuário não encontrado');
                }

                const { email, name, phone } = userData;

                await prisma.$transaction(async (prisma) => {
                    const { id: stripeCustomerId } = await stripe.customers.create({
                        email,
                        name,
                        phone,
                    });

                    const { stripe_customer_id } = await prisma.stripe_company_customers.upsert({
                        where: { company_id: company_id },
                        update: { stripe_customer_id: stripeCustomerId },
                        create: { company_id: company_id, stripe_customer_id: stripeCustomerId }
                    })

                    const customerSubscriptions = await stripe.subscriptions.list({
                        customer: stripe_customer_id,
                    });

                    const activeSubscriptions = customerSubscriptions.data.filter((subscription: { status: string }) => subscription.status === 'active');
                    if (activeSubscriptions.length > 0) throw new Error('Cliente já possui uma ou mais assinaturas ativas');

                    const { id: subscriptionId } = await stripe.subscriptions.create({
                        customer: stripe_customer_id,
                        items: [{ price: price_id }],
                        trial_period_days: 14,
                    });

                    await prisma.stripe_company_subscriptions.upsert({
                        where: { company_customer_id: company_id },
                        update: {
                            status: 'trialing',
                        },
                        create: {
                            id: subscriptionId,
                            price_id: price_id,
                            company_customer_id: company_id,
                            status: 'trialing',
                        }
                    })

                    reply.status(201).send({
                        message: "Assinatura criada com sucesso!",
                        subscription_id: subscriptionId,
                        status: 'trialing'
                    });
                })
            })
}
