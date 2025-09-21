import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { adminUpdateStudentPasswordBody } from '@idiomax/http-schemas/admin-update-student-password';
import { updateUserPasswordResponse } from '@idiomax/http-schemas/update-user-password';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { hash } from 'bcryptjs';

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
                    body: adminUpdateStudentPasswordBody,
                    response: {
                        200: updateUserPasswordResponse,
                    },
                },
            },
            async (request, reply) => {
                const { companyId, userId: targetUserId, role, newPassword } = request.body;
                const userId = await request.getCurrentUserId();

                const { company, member } = await checkMemberAccess(companyId, userId);

                // Verificar se o usuário logado é ADMIN
                if (member.role !== 'ADMIN') {
                    throw new UnauthorizedError('Apenas administradores podem redefinir senhas de usuários.');
                }

                // Verificar se o target é um estudante ou professor
                if (role !== 'STUDENT' && role !== 'TEACHER') {
                    throw new BadRequestError('Esta operação é permitida apenas para estudantes e professores.');
                }

                // Verificar se o usuário existe e está associado à empresa com a role especificada
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
                        name: true,
                    },
                });

                if (!user) {
                    throw new BadRequestError(`${role === 'STUDENT' ? 'Estudante' : 'Professor'} não encontrado ou não está associado a esta empresa.`);
                }

                // Hash da nova senha
                const hashedNewPassword = await hash(newPassword, 6);

                // Atualizar senha sem verificar a senha atual
                await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        password: hashedNewPassword,
                        updated_by: userId,
                        updated_at: new Date(),
                    },
                });

                return reply.status(200).send({
                    message: `Senha do ${role === 'STUDENT' ? 'estudante' : 'professor'} ${user.name} redefinida com sucesso pelo administrador.`,
                });
            }
        );
}