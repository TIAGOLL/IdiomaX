import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { deactivateUserParams, deactivateUserQuery, deactivateUserResponse } from '@idiomax/http-schemas/deactivate-user';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';

export async function deactivateUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/companies/:companyId/users/:userId/deactivate',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Desativar um usuário (soft delete).',
                    security: [{ bearerAuth: [] }],
                    params: deactivateUserParams,
                    querystring: deactivateUserQuery,
                    response: {
                        200: deactivateUserResponse,
                    },
                },
            },
            async (request, reply) => {
                const { companyId, userId: targetUserId } = request.params;
                const { role } = request.query;
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

                // Desativar o usuário
                await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        active: false,
                        updated_by: userId,
                        updated_at: new Date(),
                    },
                });

                return reply.status(200).send({
                    message: 'Usuário desativado com sucesso.',
                });
            },
        );
}