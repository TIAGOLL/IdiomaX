import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { auth } from "../../../middlewares/auth";
import { prisma } from "../../../lib/prisma";
import { GetUserByIdApiRequestSchema, GetUserByIdApiResponseSchema } from "@idiomax/http-schemas/users/get-user-by-id";

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

                const member = await prisma.members.findUnique({
                    where: {
                        company_id_user_id: {
                            company_id: company_id,
                            user_id: user_id
                        }
                    },
                    include: {
                        user: true
                    }
                });

                if (!member) {
                    throw new BadRequestError('Usuário não encontrado nesta empresa.');
                }

                const userWithRole = {
                    ...member.user,
                    role: member.role
                };

                return reply.send({ user: userWithRole });
            },
        );
}