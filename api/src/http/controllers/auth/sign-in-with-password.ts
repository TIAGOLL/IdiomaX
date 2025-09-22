import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from '../_errors/bad-request-error';
import { prisma } from '../../../lib/prisma';
import { SignInApiRequest, SignInApiResponse } from '@idiomax/http-schemas/auth/sign-in';

export async function SignIn(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/auth/sign-in',
            {
                schema: {
                    tags: ['Autenticação'],
                    summary: 'Realizar login com email e senha',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: SignInApiResponse,
                    },
                    body: SignInApiRequest
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
