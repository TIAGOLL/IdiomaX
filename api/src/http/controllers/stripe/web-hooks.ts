import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { auth } from '../../../middlewares/auth';
import { stripe } from '../../../lib/stripe';
import { env } from '../../server';

export async function GetProducts(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/stripe/web-hooks',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Obter dados dos eventos do Stripe',
                    security: [{ bearerAuth: [] }],
                    body: z.object({
                        id: z.string().nullable().optional(),
                        object: z.string().nullable().optional(),
                        api_version: z.string().nullable().optional(),
                        created: z.number().nullable().optional(),
                        data: z.object({
                            object: z.object({
                                id: z.string().nullable().optional(),
                                object: z.string().nullable().optional(),
                                application: z.any().nullable().optional(),
                                automatic_payment_methods: z.any().nullable().optional(),
                                cancellation_reason: z.any().nullable().optional(),
                                client_secret: z.string().nullable().optional(),
                                created: z.number().nullable().optional(),
                                customer: z.any().nullable().optional(),
                                description: z.any().nullable().optional(),
                                flow_directions: z.any().nullable().optional(),
                                last_setup_error: z.any().nullable().optional(),
                                latest_attempt: z.any().nullable().optional(),
                                livemode: z.boolean().nullable().optional(),
                                mandate: z.any().nullable().optional(),
                                metadata: z.object({}).nullable().optional(),
                                next_action: z.any().nullable().optional(),
                                on_behalf_of: z.any().nullable().optional(),
                                payment_method: z.string().nullable().optional(),
                                payment_method_options: z.object({
                                    acss_debit: z.object({
                                        currency: z.string().nullable().optional(),
                                        mandate_options: z.object({
                                            interval_description: z.string().nullable().optional(),
                                            payment_schedule: z.string().nullable().optional(),
                                            transaction_type: z.string().nullable().optional(),
                                        }).nullable().optional(),
                                        verification_method: z.string().nullable().optional(),
                                    }).nullable().optional(),
                                }).nullable().optional(),
                                payment_method_types: z.array(z.string()).nullable().optional(),
                                single_use_mandate: z.any().nullable().optional(),
                                status: z.string().nullable().optional(),
                                usage: z.string().nullable().optional(),
                            }).nullable().optional(),
                        }).nullable().optional(),
                        livemode: z.boolean().nullable().optional(),
                        pending_webhooks: z.number().nullable().optional(),
                        request: z.object({
                            id: z.any().nullable().optional(),
                            idempotency_key: z.any().nullable().optional(),
                        }).nullable().optional(),
                        type: z.string().nullable().optional(),
                    }),
                },
            },
            async (request, reply) => {

            })
}
