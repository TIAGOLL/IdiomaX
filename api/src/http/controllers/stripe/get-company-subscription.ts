import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { GetCompanySubscriptionApiRequestSchema, GetCompanySubscriptionApiResponseSchema } from '@idiomax/validation-schemas/subscriptions/get-company-subscription'
import { prisma } from '../../../lib/prisma';
import { NotFoundError } from '../_errors/not-found-error';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

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

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get-subscription', 'Company')) {
                    throw new ForbiddenError()
                }

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