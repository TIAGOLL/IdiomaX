import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { UpdateUserPasswordApiRequestSchema, UpdateUserPasswordApiResponseSchema } from '@idiomax/http-schemas/users/update-user-password';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { hash, compare } from 'bcryptjs';

export async function updateUserPassword(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/users/update-password',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Atualizar senha de um usuário.',
                    security: [{ bearerAuth: [] }],
                    body: UpdateUserPasswordApiRequestSchema,
                    response: {
                        200: UpdateUserPasswordApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { user_id: targetUserId, company_id, role, current_password, new_password } = request.body;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(company_id, userId);

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
                const isCurrentPasswordValid = await compare(current_password, user.password);

                if (!isCurrentPasswordValid) {
                    throw new BadRequestError('Senha atual incorreta.');
                }

                // Hash da nova senha
                const hashedNewPassword = await hash(new_password, 6);

                // Atualizar senha
                await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        password: hashedNewPassword,
                        updated_at: new Date(),
                    },
                });

                return reply.status(200).send({
                    message: 'Senha atualizada com sucesso.',
                });
            },
        );
}