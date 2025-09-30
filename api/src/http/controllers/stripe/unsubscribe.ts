import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { UnsubscribeApiRequestSchema, UnsubscribeApiResponseSchema } from '@idiomax/validation-schemas/subscriptions/unsubscribe';
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

                reply.status(200).send({ message: 'Assinatura cancelada.', });
            })
}

