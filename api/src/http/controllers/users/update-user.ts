import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { UpdateUserApiRequestSchema, UpdateUserApiResponseSchema } from '@idiomax/http-schemas/users/update-user';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';

export async function updateUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put(
            '/users/update',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Atualizar dados de um usuário.',
                    security: [{ bearerAuth: [] }],
                    body: UpdateUserApiRequestSchema,
                    response: {
                        200: UpdateUserApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { companyId, role, id: targetUserId, ...updateData } = request.body;
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

                // Verificar se email já existe (se fornecido)
                if (updateData.email && updateData.email !== user.email) {
                    const existingUser = await prisma.users.findFirst({
                        where: {
                            email: updateData.email,
                            id: { not: targetUserId },
                        },
                    });

                    if (existingUser) {
                        throw new BadRequestError('Este email já está sendo usado por outro usuário.');
                    }
                }

                // Verificar se CPF já existe (se fornecido)
                if (updateData.cpf && updateData.cpf !== user.cpf) {
                    const existingUser = await prisma.users.findFirst({
                        where: {
                            cpf: updateData.cpf,
                            id: { not: targetUserId },
                        },
                    });

                    if (existingUser) {
                        throw new BadRequestError('Este CPF já está sendo usado por outro usuário.');
                    }
                }

                // Atualizar usuário
                const updatedUser = await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        ...updateData,
                        updated_by: userId,
                        updated_at: new Date(),
                    },
                    include: {
                        member_on: {
                            where: {
                                company_id: companyId,
                            },
                            select: {
                                role: true,
                            },
                        },
                    },
                });

                return reply.status(200).send({
                    message: 'Usuário atualizado com sucesso.',
                    user: {
                        id: updatedUser.id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        username: updatedUser.username,
                        role: updatedUser.member_on[0]?.role || 'STUDENT',
                        updated_at: updatedUser.updated_at,
                    },
                });
            },
        );
}