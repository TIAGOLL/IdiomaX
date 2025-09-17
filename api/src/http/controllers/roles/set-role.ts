import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { UnauthorizedError } from '../_errors/unauthorized-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { setRoleRequest, setRoleResponse, } from '@idiomax/http-schemas/set-role'

export async function setRole(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put(
            '/roles',
            {
                schema: {
                    tags: ['Roles'],
                    summary: 'Atribuir roles a um usuário',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: setRoleResponse,
                    },
                    body: setRoleRequest
                },
            },
            async (request, reply) => {
                const { role_id, user_id, } = request.body;
                const userIdReq = await request.getCurrentUserId();

                // verifica se o usuário requisitante está na msm empresa solicitada e se ele é ADMIN
                const userIsAdmin = await prisma.users.findFirst({
                    where: {
                        id: userIdReq,
                        companies: {
                            some: {
                                members: {
                                    some: {
                                        user_id: userIdReq,
                                        role: "ADMIN"
                                    }
                                }
                            }
                        }
                    }
                })

                if (!userIsAdmin) {
                    throw new UnauthorizedError();
                }

                await prisma.users.update({
                    where: {
                        id: user_id
                    },
                    data: {
                        role: {
                            connect: { id: role_id }
                        }
                    }
                });

                reply.send({
                    message: "Salvo!"
                });
            },
        );
}