import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { auth } from '@/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';

export async function getUserProfile(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/auth/user-profile',
            {
                schema: {
                    tags: ['Autenticação'],
                    summary: 'Resgatar perfil do usuário',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.object({
                            name: z.string().min(3).max(256),
                            email: z.email().min(3).max(256),
                            username: z.string().min(3).max(256),
                            password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }).optional(),
                            cpf: z.string().min(11).max(11),
                            phone: z.string().min(10).max(11),
                            gender: z.string().min(1).max(1),
                            date_of_birth: z.date(),
                            address: z.string().min(1).max(255),
                            avatar_url: z.url().nullable().optional(),
                            created_at: z.date(),
                            member_on: z.array(
                                z.object({
                                    id: z.uuid(),
                                    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
                                    company_id: z.uuid(),
                                    user_id: z.uuid(),
                                    company: z.object({
                                        id: z.uuid(),
                                        email: z.email(),
                                        name: z.string(),
                                        created_at: z.date().nullable(),
                                        phone: z.string(),
                                        address: z.string(),
                                        updated_at: z.date().nullable(),
                                        cnpj: z.string(),
                                        logo_16x16_url: z.string().nullable().optional(),
                                        logo_512x512_url: z.string().nullable().optional(),
                                        social_reason: z.string().nullable(),
                                        state_registration: z.string().nullable(),
                                        tax_regime: z.string().nullable(),
                                        owner_id: z.string(),
                                    }),
                                })
                            )
                        }),
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();

                const userProfile = await prisma.users.findUnique({
                    where: { id: userId },
                    include: {
                        member_on: {
                            include: {
                                company: true
                            }
                        },
                    },
                });

                if (!userProfile) {
                    throw new BadRequestError("Usuário não encontrado.");
                }
                console.log(userProfile);
                reply.send(userProfile);
            },
        );
}