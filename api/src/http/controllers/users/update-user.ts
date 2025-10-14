import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { UpdateUserApiRequestSchema, UpdateUserApiResponseSchema } from '@idiomax/validation-schemas/users/update-user';
import { prisma } from '../../../services/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

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
                const { company_id, id: targetUserId, cpf, address, avatar_url, date_of_birth, username, name, phone, gender, email } = request.body;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('update', 'User')) {
                    throw new ForbiddenError()
                }


                // Verificar se email já existe (se fornecido)
                const existingUser = await prisma.users.findFirst({
                    where: {
                        OR: [
                            { email },
                            { username },
                            { cpf },
                        ],
                        id: { not: targetUserId },
                    },
                });

                if (existingUser?.cpf == cpf) {
                    throw new BadRequestError('Este CPF já está sendo usado por outro usuário.');
                } else if (existingUser?.email == email) {
                    throw new BadRequestError('Este email já está sendo usado por outro usuário.');
                } else if (existingUser?.username == username) {
                    throw new BadRequestError('Este nome de usuário já está sendo usado por outro usuário.');
                }

                // Atualizar usuário
                const user = await prisma.users.update({
                    where: {
                        id: targetUserId,
                        member_on: {
                            some: {
                                company_id,
                            },
                        },
                    },
                    data: {
                        name,
                        email,
                        username,
                        cpf,
                        phone,
                        avatar_url,
                        date_of_birth,
                        address,
                        gender,
                        updated_by: userId,
                        updated_at: new Date(),
                    },
                });

                if (!user) {
                    throw new BadRequestError("Erro ao atualizar o usuário.");
                }

                return reply.status(200).send({ message: 'Usuário atualizado com sucesso.' });
            },
        );
}