import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { GetCompanySubscriptionApiRequestSchema, GetCompanySubscriptionApiResponseSchema } from '@idiomax/http-schemas/subscriptions/get-company-subscription'
import { prisma } from '../../../lib/prisma';
import { NotFoundError } from '../_errors/not-found-error';

export async function GetCompanySubscription(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/stripe/get-subscription/:company_id',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Obter assinatura da empresa',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: GetCompanySubscriptionApiResponseSchema,
                    },
                    params: GetCompanySubscriptionApiRequestSchema
                },
            },
            async (request, reply) => {
                const { company_id } = request.params;

                const subscription = await prisma.stripe_company_subscriptions.findUnique({
                    where: { company_customer_id: company_id },
                    include: {
                        company_customer: {
                            include: {
                                company: true,
                            }
                        },
                        price: {
                            include: {
                                product: true,
                            }
                        }
                    },
                });

                if (!subscription) {
                    throw new NotFoundError("Assinatura não encontrada.");
                }

                reply.status(200).send(subscription);
            })
}