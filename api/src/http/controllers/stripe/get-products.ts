import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { auth } from '../../../middlewares/auth';
import { GetProductsApiResponseSchema } from '@idiomax/http-schemas/subscriptions/get-products'
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
                        200: GetProductsApiResponseSchema
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

                // Mapear os dados do Prisma para o formato esperado pelo schema
                const formattedProducts = products.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    active: product.active,
                    metadata: product.metadata as Record<string, string> | null,
                    prices: product.prices.map(price => ({
                        id: price.id,
                        currency: price.currency,
                        unit_amount: Number(price.unit_amount),
                        recurring: price.interval ? {
                            interval: price.interval,
                            interval_count: price.interval_count || 1,
                        } : null,
                        active: price.active,
                        metadata: price.metadata as Record<string, string> | null,
                    }))
                }));

                reply.status(200).send(formattedProducts);
            })
}

