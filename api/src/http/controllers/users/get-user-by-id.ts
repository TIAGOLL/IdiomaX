import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { prisma } from "src/lib/prisma";
import { auth } from "src/middlewares/auth";

export async function getUserById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/users/:id',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Obter informações de um usuário pelo ID.',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.object({
                            id: z.string(),
                            name: z.string(),
                            email: z.string().email(),
                            username: z.string(),
                            password: z.string(),
                            cpf: z.string(),
                            phone: z.string(),
                            gender: z.string(),
                            date_of_birth: z.coerce.date(),
                            address: z.string(),
                            active: z.boolean(),
                            avatar_url: z.url().nullable(),
                            created_at: z.date().nullable(),
                            updated_at: z.date().nullable(),
                        }),
                    },
                    params: z.object({
                        id: z.uuid(),
                    })
                },
            },
            async (request, reply) => {
                const { id } = request.params;

                const user = await prisma.users.findUnique({
                    where: {
                        id: id,
                    },
                });

                if (!user) {
                    throw new BadRequestError('Usuário não encontrado.');
                }

                return reply.send(user);
            },
        );
}