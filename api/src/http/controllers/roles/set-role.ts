import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { UnauthorizedError } from '../_errors/unauthorized-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { SetRoleApiRequestSchema, SetRoleApiResponseSchema } from '@idiomax/http-schemas/users/set-role'

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
                        200: SetRoleApiResponseSchema,
                    },
                    body: SetRoleApiRequestSchema
                },
            },
            async (request, reply) => {
                const { role, user_id, company_id } = request.body;
                const userIdReq = await request.getCurrentUserId();

                // verifica se o usuário requisitante está na msm empresa solicitada e se ele é ADMIN
                const userIsAdmin = await prisma.members.findFirst({
                    where: {
                        user_id: userIdReq,
                        company_id: company_id,
                        role: "ADMIN"
                    }
                })

                if (!userIsAdmin) {
                    throw new UnauthorizedError();
                }

                await prisma.members.update({
                    where: {
                        company_id_user_id: {
                            company_id: company_id,
                            user_id: user_id
                        }
                    },
                    data: {
                        role: role
                    }
                });

                reply.send({
                    message: "Salvo!"
                });
            },
        );
}