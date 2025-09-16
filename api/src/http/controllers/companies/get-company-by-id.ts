import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { auth } from 'src/middlewares/auth';
import { prisma } from 'src/lib/prisma';

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
                        companyId: z.uuid()
                    }),
                    response: {
                        200: z.object({
                            id: z.uuid(),
                            name: z.string(),
                            cnpj: z.string(),
                            phone: z.string(),
                            email: z.email(),
                            logo_16x16_url: z.url().optional(),
                            logo_512x512_url: z.url().optional(),
                            social_reason: z.string(),
                            state_registration: z.string(),
                            tax_regime: z.string(),
                            address: z.string(),
                            created_at: z.coerce.date(),
                            updated_at: z.coerce.date(),
                        }),
                    },
                },
            },
            async (request, reply) => {
                const { companyId } = request.params;
                const userId = await request.getCurrentUserId();

                const userIsMember = await prisma.members.findFirst({
                    where: {
                        user_id: userId,
                        company_id: companyId,
                    }
                });

                if (!userIsMember) {
                    throw new BadRequestError('Usuário não está associado a essa instituição.');
                }

                const company = await prisma.companies.findUnique({
                    where: {
                        id: companyId,
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
