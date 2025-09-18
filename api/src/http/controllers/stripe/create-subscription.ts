import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { stripe } from '../../../lib/stripe';
import { env } from '../../server';
import { createSubscriptionRequest, createSubscriptionResponse } from '@idiomax/http-schemas/create-subscription'
import { BadRequestError } from '../_errors/bad-request-error';
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

                    const { stripe_customer_id } = await prisma.stripeCompanyCustomer.create({
                        data: {
                            company_id: companyId,
                            stripe_customer_id: stripeCustomerId,
                        }
                    })

                    const customerSubscriptions = await stripe.subscriptions.list({
                        customer: stripe_customer_id,
                    });

                    const activeSubscriptions = customerSubscriptions.data.filter((subscription: { status: string }) => subscription.status === 'active');
                    if (activeSubscriptions.length > 0) throw new Error('Cliente já possui uma ou mais assinaturas ativas');

                    await stripe.subscriptions.create({
                        customer: stripe_customer_id,
                        items: [{ price: priceId }],
                        trial_period_days: 14,
                    });
                })
                
                reply.status(201).send({ message: "Assinatura criada com sucesso!" });
            })
}
