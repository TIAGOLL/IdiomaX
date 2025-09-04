import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';

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
                        200: z.object({
                            token: z.string(),
                            message: z.string(),
                        }),
                    },
                    body: z.object({
                        username: z.string(),
                        password: z.string().min(6),
                        userType: z.string().refine((value) => ['student', 'professional'].includes(value), {
                            message: 'Selecione um tipo de usuário',
                        }),
                    }),
                },
            },
            async (request, reply) => {
                const { username, password, userType } = request.body;

                try {
                    if (userType === 'professional' || userType === 'student') {
                        const user = await prisma.users.findUnique({
                            where: { username },
                        });

                        if (!user || !(await bcrypt.compare(password, user.password))) {
                            throw new BadRequestError('Credenciais inválidas');
                        }

                        const token = app.jwt.sign({ sub: user.id });

                        reply.status(200).send({
                            token,
                            message: 'Bem vindo!',
                        });
                    } else {
                        throw new BadRequestError('Tipo de usuário inválido');
                    }
                } catch (e) {
                    throw new BadRequestError(e);
                }
            },
        );
}
