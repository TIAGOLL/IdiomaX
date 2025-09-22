import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { DeactivateUserApiRequestSchema, DeactivateUserApiResponseSchema } from '@idiomax/http-schemas/users/deactivate-user';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';

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
                const { userId: targetUserId, role, companyId, active } = request.body;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(companyId, userId);

                // Verificar se o usuário existe e está associado à empresa com o role correto
                const user = await prisma.users.findFirst({
                    where: {
                        id: targetUserId,
                        member_on: {
                            some: {
                                company_id: company.id,
                                role: role,
                            }
                        }
                    },
                });

                if (!user) {
                    throw new BadRequestError(`Usuário não encontrado ou não está associado a esta empresa com o role ${role}.`);
                }

                // Ativar ou desativar o usuário
                const updatedUser = await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        active: active,
                        updated_by: userId,
                        updated_at: new Date(),
                    },
                });

                return reply.status(200).send({
                    message: active ? 'Usuário ativado com sucesso.' : 'Usuário desativado com sucesso.',
                    user: {
                        id: updatedUser.id,
                        name: updatedUser.name,
                        active: updatedUser.active,
                    },
                });
            },
        );
}