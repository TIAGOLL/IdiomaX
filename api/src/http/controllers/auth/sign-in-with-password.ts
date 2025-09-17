import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from '../_errors/bad-request-error';
import { prisma } from '../../../lib/prisma';
import { signInWithPasswordResponse, signInWithPasswordRequest } from '@idiomax/http-schemas/sign-in-with-password';

export async function SignInWithPassword(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/auth/sign-in-with-password',
            {
                schema: {
                    tags: ['Autenticação'],
                    summary: 'Realizar login com email e senha',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: signInWithPasswordResponse,
                    },
                    body: signInWithPasswordRequest
                },
            },
            async (request, reply) => {
                const { username, password } = request.body;

                try {
                    const user = await prisma.users.findUnique({
                        where: { username },
                        include: {
                            member_on: {
                                include: {
                                    company: true,
                                }
                            }
                        }
                    });

                    if (!user || !(await bcrypt.compare(password, user.password))) {
                        throw new BadRequestError('Credenciais inválidas');
                    }

                    const token = app.jwt.sign({
                        sub: user.id,
                    });

                    reply.status(200).send({
                        token,
                        message: 'Bem vindo!',
                    });
                } catch (e) {
                    throw new BadRequestError(e);
                }
            },
        );
}
