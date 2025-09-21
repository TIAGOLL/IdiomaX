import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { addUserRoleBody, addUserRoleResponse } from '@idiomax/http-schemas/add-user-role';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function addUserRole(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/users/roles/add',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Adicionar role a um usuário na empresa.',
                    security: [{ bearerAuth: [] }],
                    body: addUserRoleBody,
                    response: {
                        200: addUserRoleResponse,
                    },
                },
            },
            async (request, reply) => {
                const { userId: targetUserId, role, companyId } = request.body;
                const userId = await request.getCurrentUserId();

                const { company, member } = await checkMemberAccess(companyId, userId);

                // Verificar se o usuário logado é ADMIN
                if (member.role !== 'ADMIN') {
                    throw new UnauthorizedError('Apenas administradores podem gerenciar roles de usuários.');
                }

                // Verificar se o usuário alvo existe
                const targetUser = await prisma.users.findUnique({
                    where: { id: targetUserId },
                });

                if (!targetUser) {
                    throw new BadRequestError('Usuário não encontrado.');
                }

                // Verificar se o usuário já tem essa role na empresa
                const existingMember = await prisma.members.findFirst({
                    where: {
                        user_id: targetUserId,
                        company_id: company.id,
                        role: role,
                    },
                });

                if (existingMember) {
                    throw new BadRequestError(`Usuário já possui a role ${role} nesta empresa.`);
                }

                // Adicionar a role
                await prisma.members.create({
                    data: {
                        user_id: targetUserId,
                        company_id: company.id,
                        role: role,
                        created_by: userId,
                    },
                });

                return reply.status(200).send({
                    message: `Role ${role} adicionada com sucesso.`,
                });
            },
        );
}