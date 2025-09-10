import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';
import { toUint8Array } from '@/lib/to-uint-8-array';

export async function getCompanyById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/companies/:id',
            {
                schema: {
                    tags: ['Instituições'],
                    summary: 'Obter uma instituição de ensino pelo ID.',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        id: z.uuid()
                    }),
                    response: {
                        200: z.object({
                            id: z.uuid(),
                            name: z.string(),
                            cnpj: z.string(),
                            phone: z.string(),
                            email: z.email(),
                            social_reason: z.string(),
                            state_registration: z.string(),
                            tax_regime: z.string(),
                            address: z.string(),
                            owner_id: z.string(),
                            created_at: z.coerce.date(),
                            updated_at: z.coerce.date(),
                        }),
                    },
                },
            },
            async (request, reply) => {
                const { id } = request.params;
                const userId = await request.getCurrentUserId()

                const company = await prisma.companies.findUnique({
                    where: {
                        id,
                        members: {
                            some: {
                                user_id: userId,
                            }
                        }
                    },
                }).catch((err) => console.log(err));

                if (!company) {
                    throw new BadRequestError('Instituição não encontrada ou você não tem acesso a ela.');
                }

                return reply.status(200).send(company);
            },
        );
}
