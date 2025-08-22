import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { auth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';

export async function Authenticate(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/auth/sign-in-with-password',
            {
                schema: {
                    tags: ['Users'],
                    summary: 'Realizar login com email e senha',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        id: z.string(),
                    }),
                    response: {
                        200: z.object({
                            token: z.string()
                        }),
                    },
                    body: z.object({
                        email: z.email(),
                        password: z.string().min(6),
                    }),
                },
            },
            async (request) => {
                const { email, password } = request.body;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !(await bcrypt.compare(password, user.password))) {
                    throw new Error('Email ou senha inválidos');
                }

                const token = app.jwt.sign({ sub: user.id });

                return {
                    token,
                };
            },
        );
}
