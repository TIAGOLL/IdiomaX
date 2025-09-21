import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { updateUserBody, updateUserResponse } from '@idiomax/http-schemas/update-user';
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
                    body: updateUserBody,
                    response: {
                        200: updateUserResponse,
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
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });

                return reply.status(200).send({
                    message: 'Usuário atualizado com sucesso.',
                    user: updatedUser,
                });
            },
        );
}