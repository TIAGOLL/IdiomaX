import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { auth } from '@/middlewares/auth';
import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function setRole(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/roles',
            {
                schema: {
                    tags: ['Roles'],
                    summary: 'Atribuir roles a um usuário',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.object({
                            message: z.string()
                        })
                    },
                    body: z.object({
                        userId: z.string(),
                        roleId: z.string(),
                        companyId: z.string()
                    }),
                },
            },
            async (request, reply) => {
                const { roleId, userId, companyId } = request.body;
                const userIdReq = await request.getCurrentUserId();

                // verifica se o usuário requisitante está na msm empresa solicitada e se ele é ADMIN
                const userIsAdmin = await prisma.users_in_companies.findFirst({
                    where: {
                        companies_id: companyId,
                        users_id: userIdReq,
                        users_in_companies_roles: {
                            some: {
                                roles: {
                                    name: "ADMIN"
                                }
                            }
                        }
                    }
                })

                if (!userIsAdmin) {
                    throw new UnauthorizedError();
                }

                await prisma.users_in_companies_roles.create({
                    data: {
                        users_in_companies: {
                            connectOrCreate: {
                                where: {
                                    users_id_companies_id: {
                                        users_id: userId,
                                        companies_id: companyId
                                    }
                                },
                                create: {
                                    users_id: userId,
                                    companies_id: companyId,
                                }
                            }
                        },
                        roles: {
                            connect: { id: roleId }
                        }
                    }
                });

                reply.send({
                    message: "Salvo!"
                });
            },
        );
}