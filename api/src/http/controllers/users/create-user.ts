import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { BadRequestError } from '../_errors/bad-request-error';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { CreateUserApiRequestSchema, CreateUserApiResponseSchema } from '@idiomax/http-schemas/users';
import { hash } from 'bcryptjs';

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

                const userAlreadyExists = await prisma.users.findUnique({
                    where: {
                        username: username,
                        OR: [
                            { email: email },
                            { cpf: cpf },
                        ]
                    },
                });

                if (userAlreadyExists.email === email) {
                    throw new BadRequestError('Já existe um usuário com esse email.');
                } else if (userAlreadyExists.cpf === cpf) {
                    throw new BadRequestError('Já existe um usuário com esse CPF.');
                } else if (userAlreadyExists.username === username) {
                    throw new BadRequestError('Já existe um usuário com esse username.');
                }

                const userId = await request.getCurrentUserId()
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