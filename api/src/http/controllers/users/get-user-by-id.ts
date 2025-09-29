import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { auth } from "../../../middlewares/auth";
import { prisma } from "../../../lib/prisma";
import { GetUserByIdApiRequestSchema, GetUserByIdApiResponseSchema } from "@idiomax/validation-schemas/users/get-user-by-id";

export async function getUserById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/users/by-id',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Obter informações de um usuário pelo ID.',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: GetUserByIdApiResponseSchema
                    },
                    querystring: GetUserByIdApiRequestSchema
                },
            },
            async (request, reply) => {
                const { user_id, company_id } = request.query;

                const user = await prisma.users.findFirst({
                    where: {
                        member_on: {
                            some: {
                                user_id: user_id,
                                company_id: company_id,
                            }
                        }
                    },
                    include: {
                        member_on: {
                            include: { company: true }
                        }
                    }
                });

                if (!user) {
                    throw new BadRequestError('Usuário não encontrado nesta empresa.');
                }

                return reply.send(user);
            },
        );
}