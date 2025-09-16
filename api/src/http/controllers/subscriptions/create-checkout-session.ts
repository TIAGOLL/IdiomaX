import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '../_errors/unauthorized-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { stripe } from '../../../lib/stripe';
import { env } from '../../server';

export async function CreateCheckoutSession(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/create-checkout-session',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Criar uma sessão de checkout para um plano de assinatura',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.object({
                            url: z.url(),
                        })
                    },
                    body: z.object({
                        productId: z.string(),
                    }),
                },
            },
            async (request, reply) => {

                //Pagamento concluído
                // 4242 4242 4242 4242
                // Pagamento precisa de autenticação
                // 4000 0025 0000 3155
                // Pagamento recusado
                // 4000 0000 0000 9995

                const prices = await stripe.prices.list({
                    product: request.body.productId,
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
                    mode: 'subscription',
                    success_url: `${env.data.WEB_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${env.data.WEB_URL}?canceled=true`,
                });

                reply.status(200).send({ url: session.url });
            })
}
