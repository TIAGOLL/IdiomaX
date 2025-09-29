import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/get-user-permission';
import { RemoveUserRoleApiRequestSchema, RemoveUserRoleApiResponseSchema } from '@idiomax/validation-schemas/users/remove-user-role';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function removeUserRole(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/users/roles/remove',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Remover role de um usuário na empresa.',
                    security: [{ bearerAuth: [] }],
                    body: RemoveUserRoleApiRequestSchema,
                    response: {
                        200: RemoveUserRoleApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { user_id: targetUserId, role, company_id } = request.body;
                const userId = await request.getCurrentUserId();

                const { company, member } = await checkMemberAccess(company_id, userId);

                // Verificar se o usuário logado é ADMIN
                if (member.role !== 'ADMIN') {
                    throw new UnauthorizedError('Apenas administradores podem gerenciar roles de usuários.');
                }

                // Não permitir remover role ADMIN se for a única
                if (role === 'ADMIN') {
                    const adminCount = await prisma.members.count({
                        where: {
                            company_id: company.id,
                            role: 'ADMIN',
                        },
                    });

                    if (adminCount <= 1) {
                        throw new BadRequestError('Não é possível remover o último administrador da empresa.');
                    }
                }

                // Verificar se o usuário tem essa role na empresa
                const memberToRemove = await prisma.members.findFirst({
                    where: {
                        user_id: targetUserId,
                        company_id: company.id,
                        role: role,
                    },
                });

                if (!memberToRemove) {
                    throw new BadRequestError(`Usuário não possui a role ${role} nesta empresa.`);
                }

                // Remover a role
                await prisma.members.delete({
                    where: {
                        id: memberToRemove.id,
                    },
                });

                return reply.status(200).send({
                    message: `Role ${role} removida com sucesso.`,
                });
            },
        );
}