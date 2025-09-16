import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { BadRequestError } from '../_errors/bad-request-error';
import { auth } from '../../../middlewares/auth';
import z from 'zod';
import { prisma } from '../../../lib/prisma';

export async function createCompany(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/create-companies',
            {
                schema: {
                    tags: ['Instituições'],
                    summary: 'Criar uma nova instituição de ensino.',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.object({
                            message: z.string()
                        }),
                    },
                    body: z.object({
                        name: z.string().min(3).max(100),
                        cnpj: z.string().min(14).max(14),
                        phone: z.string().min(11).max(11),
                        email: z.email(),
                        logo_16x16_url: z.url().optional(),
                        logo_512x512_url: z.url().optional(),
                        social_reason: z.string().min(3).max(256),
                        state_registration: z.string().min(3).max(256),
                        tax_regime: z.string().min(3).max(256),
                        address: z.string().min(3).max(256),
                    }),
                },
            },
            async (request, reply) => {
                const { name, address, cnpj, phone, email, logo_16x16_url, logo_512x512_url, social_reason, state_registration, tax_regime, } = request.body;

                const companyAlreadyExists = await prisma.companies.findUnique({
                    where: {
                        cnpj: cnpj,
                    },
                });

                const userId = await request.getCurrentUserId()

                if (companyAlreadyExists) {
                    throw new BadRequestError('Já existe uma instituição com esse CNPJ.');
                }

                await prisma.companies.create({
                    data: {
                        name,
                        address,
                        cnpj,
                        phone,
                        email,
                        logo_16x16_url,
                        logo_512x512_url,
                        social_reason,
                        state_registration,
                        tax_regime,
                        owner: {
                            connect: {
                                id: userId,
                            }
                        },
                        members: {
                            create: {
                                user_id: userId,
                                role: 'ADMIN',
                            }
                        }
                    },
                });

                return reply.status(200).send({ message: 'Instituição criada com sucesso.' });
            },
        );
}