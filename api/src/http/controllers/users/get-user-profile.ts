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
                            email: z.email(),
                            name: z.string().min(2).max(100),
                            created_at: z.date(),
                            avatar: z.string().nullable().optional(),
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
                                        logo_16x16: z.string().nullable().optional(),
                                        logo_512x512: z.string().nullable().optional(),
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
                    select: {
                        email: true,
                        name: true,
                        created_at: true,
                        avatar: true,
                        member_on: {
                            include: {
                                company: {
                                    omit: {
                                        logo_16x16: true,
                                        logo_512x512: true,
                                    }
                                }
                            }
                        },
                    },
                });

                if (!userProfile) {
                    throw new BadRequestError("Usuário não encontrado.");
                }
                console.log(userProfile)
                reply.send({
                    ...userProfile,
                    avatar: userProfile.avatar ? Buffer.from(userProfile.avatar).toString('base64') : null,
                });
            },
        );
}