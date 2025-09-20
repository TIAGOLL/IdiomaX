import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { auth } from "../../../middlewares/auth";
import { prisma } from "../../../lib/prisma";
import { getUserByIdRequest, getUserByIdResponse } from "@idiomax/http-schemas/get-user-by-id";

export async function getUserById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/companies/:companyId/users/:id',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Obter informações de um usuário pelo ID.',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: getUserByIdResponse
                    },
                    params: getUserByIdRequest
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