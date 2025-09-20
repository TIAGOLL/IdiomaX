import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { updateUserPasswordParams, updateUserPasswordQuery, updateUserPasswordBody, updateUserPasswordResponse } from '@idiomax/http-schemas/update-user-password';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { hash, compare } from 'bcryptjs';

export async function updateUserPassword(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/companies/:companyId/users/:userId/password',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Atualizar senha de um usuário.',
                    security: [{ bearerAuth: [] }],
                    params: updateUserPasswordParams,
                    querystring: updateUserPasswordQuery,
                    body: updateUserPasswordBody,
                    response: {
                        200: updateUserPasswordResponse,
                    },
                },
            },
            async (request, reply) => {
                const { companyId, userId: targetUserId } = request.params;
                const { role } = request.query;
                const { currentPassword, newPassword } = request.body;
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
                    select: {
                        id: true,
                        password: true,
                    },
                });

                if (!user) {
                    throw new BadRequestError(`Usuário não encontrado ou não está associado a esta empresa com o role ${role}.`);
                }

                // Verificar senha atual
                const isCurrentPasswordValid = await compare(currentPassword, user.password);

                if (!isCurrentPasswordValid) {
                    throw new BadRequestError('Senha atual incorreta.');
                }

                // Hash da nova senha
                const hashedNewPassword = await hash(newPassword, 6);

                // Atualizar senha
                await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        password: hashedNewPassword,
                        updated_by: userId,
                        updated_at: new Date(),
                    },
                });

                return reply.status(200).send({
                    message: 'Senha atualizada com sucesso.',
                });
            },
        );
}