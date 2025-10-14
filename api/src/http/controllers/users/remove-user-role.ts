import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { RemoveUserRoleApiRequestSchema, RemoveUserRoleApiResponseSchema } from '@idiomax/validation-schemas/users/remove-user-role';
import { prisma } from '../../../services/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { roleSchema } from '@idiomax/authorization';

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
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('delete', 'Role')) {
                    throw new ForbiddenError()
                }

                // Não permitir remover role ADMIN se for a única
                if (role === 'ADMIN') {
                    const adminCount = await prisma.members.count({
                        where: {
                            company_id,
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
                        company_id,
                        role: roleSchema.parse(role),
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