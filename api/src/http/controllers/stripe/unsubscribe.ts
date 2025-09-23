import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { UnsubscribeApiRequestSchema, UnsubscribeApiResponseSchema } from '@idiomax/http-schemas/subscriptions/unsubscribe';
import { stripe } from '../../../lib/stripe';

export async function Unsubscribe(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/stripe/unsubscribe',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Cancelar assinatura do Stripe',
                    security: [{ bearerAuth: [] }],
                    body: UnsubscribeApiRequestSchema,
                    response: {
                        200: UnsubscribeApiResponseSchema
                    },
                },
            },
            async (request, reply) => {
                const { subscription_id } = request.body;

                await stripe.subscriptions.cancel(subscription_id);

                reply.status(200).send({
                    message: 'Assinatura cancelada.',
                    subscription: {
                        id: subscription_id,
                        status: 'canceled',
                        cancel_at_period_end: false,
                        canceled_at: Math.floor(Date.now() / 1000),
                        current_period_end: Math.floor(Date.now() / 1000),
                    }
                });
            })
}

