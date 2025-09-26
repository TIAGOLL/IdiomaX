import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/get-user-permission';
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
                const { companyId, id: targetUserId, cpf, address, avatar_url, date_of_birth, username, name, phone, gender, email } = request.body;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(companyId, userId);

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
                                company_id: company.id,
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
                    throw new BadRequestError(`Usuário não encontrado ou não está associado a esta empresa.`);
                }

                return reply.status(200).send({ message: 'Usuário atualizado com sucesso.' });
            },
        );
}