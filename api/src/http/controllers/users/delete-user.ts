import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/get-user-permission';
import { DeleteUserApiRequestSchema, DeleteUserApiResponseSchema } from '@idiomax/validation-schemas/users/delete-user';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';

export async function deleteUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/users/delete',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Deletar um usuário permanentemente.',
                    security: [{ bearerAuth: [] }],
                    body: DeleteUserApiRequestSchema,
                    response: {
                        200: DeleteUserApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, user_id: targetUserId } = request.body;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(company_id, userId);

                // Verificar se o usuário existe e está associado à empresa com o role correto
                const user = await prisma.users.findFirst({
                    where: {
                        id: targetUserId,
                        member_on: {
                            some: {
                                company_id: company.id,
                            }
                        }
                    },
                });

                if (!user) {
                    throw new BadRequestError(`Usuário não encontrado ou não está associado a esta empresa.`);
                }

                // Deletar o relacionamento da empresa primeiro
                await prisma.members.deleteMany({
                    where: {
                        user_id: targetUserId,
                        company_id: company.id,
                    },
                });

                return reply.status(200).send({
                    message: 'Usuário removido com sucesso.',
                });
            },
        );
}