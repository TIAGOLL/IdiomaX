import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { unsubscribeRequest, unsubscribeResponse } from '@idiomax/http-schemas/unsubscribe';
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
                    summary: 'Obter produtos disponíveis para assinatura',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: unsubscribeResponse
                    },
                    body: unsubscribeRequest,
                },
            },
            async (request, reply) => {
                const { subscriptionId } = request.body;

                await stripe.subscriptions.cancel(subscriptionId);

                reply.status(200).send({ message: 'Assinatura cancelada.' });
            })
}

