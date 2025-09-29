import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { BadRequestError } from '../_errors/bad-request-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { CreateUserApiRequestSchema, CreateUserApiResponseSchema } from '@idiomax/http-schemas/users';
import { hash } from 'bcryptjs';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function createUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/users',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Criar um novo usuário, membro de uma instituição.',
                    security: [{ bearerAuth: [] }],
                    response: {
                        201: CreateUserApiResponseSchema,
                    },
                    body: CreateUserApiRequestSchema,
                },
            },
            async (request, reply) => {
                const { name, address, phone, email, username, cpf, password, avatar_url, role, gender, date_of_birth, company_id } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('create', 'User')) {
                    throw new ForbiddenError()
                }

                // Verifica se já existe usuário com email, cpf ou username
                const userAlreadyExists = await prisma.users.findFirst({
                    where: {
                        OR: [
                            { email: email },
                            { cpf: cpf },
                            { username: username },
                        ]
                    },
                });

                if (userAlreadyExists?.email === email) {
                    throw new BadRequestError('Já existe um usuário com esse email.');
                } else if (userAlreadyExists?.cpf === cpf) {
                    throw new BadRequestError('Já existe um usuário com esse CPF.');
                } else if (userAlreadyExists?.username === username) {
                    throw new BadRequestError('Já existe um usuário com esse username.');
                }

                const passwordHash = await hash(password, 8);

                await prisma.users.create({
                    data: {
                        name,
                        address,
                        phone,
                        email,
                        username,
                        cpf,
                        active: true,
                        password: passwordHash,
                        created_by: userId,
                        avatar_url,
                        gender,
                        date_of_birth,
                        updated_by: userId,
                        member_on: {
                            create: {
                                company_id,
                                role,
                                created_by: userId,
                                updated_by: userId,
                            }
                        },
                    },
                });

                return reply.status(201).send({
                    message: 'Usuário criado com sucesso.',
                });
            },
        );
}