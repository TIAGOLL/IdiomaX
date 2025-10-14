import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { stripe } from '../../../services/stripe';
import { ENV } from '../../server';
import { CreateCheckoutSessionApiRequestSchema, CreateCheckoutSessionApiResponseSchema } from '@idiomax/validation-schemas/subscriptions/create-checkout-session';
import { prisma } from '../../../services/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function CreateCheckoutSession(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/stripe/create-checkout-session',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Criar uma sessão de checkout para um plano de assinatura',
                    security: [{ bearerAuth: [] }],
                    response: {
                        201: CreateCheckoutSessionApiResponseSchema
                    },
                    body: CreateCheckoutSessionApiRequestSchema
                },
            },
            async (request, reply) => {

                //Pagamento concluído
                // 4242 4242 4242 4242
                // Pagamento precisa de autenticação
                // 4000 0025 0000 3155
                // Pagamento recusado
                // 4000 0000 0000 9995

                const { prod_id, company_id } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)
                console.log('member', member)
                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('create-subscription', 'Company')) {
                    throw new ForbiddenError()
                }

                const data = await prisma.stripe_company_customers.findFirst({
                    where: { company_id: company_id },
                    select: { stripe_customer_id: true }
                })

                const prices = await stripe.prices.list({
                    product: prod_id,
                    expand: ['data.product'],
                });

                const session = await stripe.checkout.sessions.create({
                    billing_address_collection: 'auto',
                    line_items: [
                        {
                            price: prices.data[0].id,
                            quantity: 1,
                        },
                    ],
                    customer: data?.stripe_customer_id ? data.stripe_customer_id : undefined,
                    mode: 'subscription',
                    success_url: `${ENV.WEB_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${ENV.WEB_URL}?canceled=true`,
                })

                reply.status(201).send({
                    checkout_url: session.url!,
                    session_id: session.id
                });
            })
}
