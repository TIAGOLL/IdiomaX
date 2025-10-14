import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../services/prisma';
import { hash } from 'bcryptjs';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { BadRequestError } from '../_errors/bad-request-error';
import { ApiAdminUpdateStudentPasswordRequest, ApiAdminUpdateStudentPasswordResponse } from '@idiomax/validation-schemas/users/admin-update-student-password';

export async function adminUpdateStudentPassword(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/users/admin-reset-password',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Admin redefinir senha de estudante/professor via body.',
                    security: [{ bearerAuth: [] }],
                    body: ApiAdminUpdateStudentPasswordRequest,
                    response: {
                        200: ApiAdminUpdateStudentPasswordResponse,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, user_id: targetUserId, new_password } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('update', 'User')) {
                    throw new ForbiddenError()
                }

                // Verificar se o usuário alvo é um admin - admin não pode ter senha alterada
                const targetMember = await prisma.members.findFirst({
                    where: {
                        user_id: targetUserId,
                        company_id: company_id,
                    }
                });

                if (!targetMember) {
                    throw new ForbiddenError('Usuário não encontrado.');
                }
                else if (targetMember?.role == 'ADMIN') {
                    throw new ForbiddenError('Não é possível alterar a senha de um administrador.');
                }

                // Hash da nova senha
                const hashedNewPassword = await hash(new_password, 6);

                // Atualizar senha sem verificar a senha atual
                const res = await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        password: hashedNewPassword,
                        updated_by: userId,
                    },
                });

                if (!res) {
                    throw new BadRequestError('Erro ao atualizar a senha.');
                }

                return reply.status(200).send({
                    message: "Senha redefinida com sucesso.",
                });
            }
        );
}