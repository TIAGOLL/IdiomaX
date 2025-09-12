import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { email, z } from 'zod';
import { Buffer } from "buffer";
import { prisma } from '@/lib/prisma';
import { auth } from '@/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';

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
                            logo_16x16: z.string().nullable().optional(),
                            logo_512x512: z.string().nullable().optional(),
                            social_reason: z.string(),
                            state_registration: z.string(),
                            tax_regime: z.string(),
                            address: z.string(),
                            owner_id: z.string().optional(),
                            created_at: z.coerce.date(),
                            updated_at: z.coerce.date(),
                        }),
                    },
                },
            },
            async (request, reply) => {
                const { id } = request.params;
                const userId = await request.getCurrentUserId()

                const user = await prisma.users.findUnique({
                    where: {
                        id: userId,
                        member_on: {
                            some: { company_id: id }
                        }
                    },
                });

                if (!user) {
                    throw new UnauthorizedError('Usuário não está associado a essa instituição.');
                }

                const company = await prisma.companies.findUnique({
                    where: {
                        id,
                    },
                });

                if (!company) {
                    throw new BadRequestError('Instituição não encontrada.');
                }

                return reply.status(200).send(
                    {
                        ...company,
                        logo_16x16: company.logo_16x16 ? Buffer.from(company.logo_16x16).toString('base64') : null,
                        logo_512x512: company.logo_512x512 ? Buffer.from(company.logo_512x512).toString('base64') : null,
                    }
                );
            },
        );
}
