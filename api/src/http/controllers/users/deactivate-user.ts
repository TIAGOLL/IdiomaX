import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { DeactivateUserApiRequestSchema, DeactivateUserApiResponseSchema } from '@idiomax/validation-schemas/users/deactivate-user';
import { prisma } from '../../../services/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function deactivateUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/users/deactivate',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Ativar ou desativar um usuário via body.',
                    security: [{ bearerAuth: [] }],
                    body: DeactivateUserApiRequestSchema,
                    response: {
                        200: DeactivateUserApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { user_id: targetUserId, company_id, active } = request.body;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('delete', 'User')) {
                    throw new ForbiddenError()
                }
                // Verificar se o usuário existe e está associado à empresa com o role correto
                const user = await prisma.users.findFirst({
                    where: {
                        id: targetUserId,
                        member_on: {
                            some: {
                                company_id,
                            }
                        }
                    },
                });

                if (!user) {
                    throw new BadRequestError(`Usuário não encontrado ou não está associado a esta empresa.`);
                }

                // Ativar ou desativar o usuário
                await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        active: active,
                        updated_by: userId,
                        updated_at: new Date(),
                        member_on: {
                            updateMany: {
                                where: {
                                    company_id,
                                    user_id: targetUserId,
                                },
                                data: {
                                    active: active,
                                    updated_by: userId,
                                    updated_at: new Date(),
                                }
                            },
                        }
                    },
                });

                return reply.status(200).send({
                    message: active ?
                        'Usuário ativado com sucesso.' :
                        'Usuário desativado com sucesso.',
                });
            },
        );
}