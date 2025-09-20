import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { deleteUserParams, deleteUserQuery, deleteUserResponse } from '@idiomax/http-schemas/delete-user';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';

export async function deleteUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/companies/:companyId/users/:userId',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Deletar um usuário permanentemente.',
                    security: [{ bearerAuth: [] }],
                    params: deleteUserParams,
                    querystring: deleteUserQuery,
                    response: {
                        200: deleteUserResponse,
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

                // Deletar o relacionamento da empresa primeiro
                await prisma.members.deleteMany({
                    where: {
                        user_id: targetUserId,
                        company_id: company.id,
                        role: role,
                    },
                });

                // Verificar se o usuário ainda é membro de outras empresas
                const otherMemberships = await prisma.members.findFirst({
                    where: {
                        user_id: targetUserId,
                    },
                });

                // Se não for membro de nenhuma outra empresa, deletar o usuário
                if (!otherMemberships) {
                    await prisma.users.delete({
                        where: { id: targetUserId },
                    });
                }

                return reply.status(200).send({
                    message: 'Usuário removido com sucesso.',
                });
            },
        );
}