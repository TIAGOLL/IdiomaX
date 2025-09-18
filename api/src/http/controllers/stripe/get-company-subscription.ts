import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { getCompanySubscriptionParams, getCompanySubscriptionResponse } from '@idiomax/http-schemas/get-company-subscription'
import { prisma } from '../../../lib/prisma';
import { NotFoundError } from '../_errors/not-found-error';

export async function GetCompanySubscription(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/stripe/get-subscription/:companyId',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Obter assinatura da empresa',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: getCompanySubscriptionResponse,
                    },
                    params: getCompanySubscriptionParams
                },
            },
            async (request, reply) => {
                const { companyId } = request.params;

                const subscription = await prisma.stripeCompanySubscription.findUnique({
                    where: { company_customer_id: companyId },
                });

                if (!subscription) {
                    throw new NotFoundError("Assinatura não encontrada.");
                }

                reply.status(200).send(subscription);
            })
}
