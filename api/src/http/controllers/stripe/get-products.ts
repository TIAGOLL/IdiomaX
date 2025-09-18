import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { getProductsResponse } from '@idiomax/http-schemas/get-products'
import { prisma } from '../../../lib/prisma';

export async function GetProducts(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/stripe/get-products',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Obter produtos disponíveis para assinatura',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: getProductsResponse
                    },
                },
            },
            async (request, reply) => {

                const products = await prisma.stripeProduct.findMany({
                    where: {
                        active: true,
                    },
                    include: {
                        prices: {
                            where: {
                                active: true
                            }
                        }
                    }
                });

                reply.status(200).send(products);
            })
}

