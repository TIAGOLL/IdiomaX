import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { DeleteUserApiRequestSchema, DeleteUserApiResponseSchema } from '@idiomax/http-schemas/users/delete-user';
import { prisma } from '../../../lib/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

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
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('delete', 'User')) {
                    throw new ForbiddenError()
                }

                // Deletar o relacionamento da empresa primeiro
                await prisma.members.deleteMany({
                    where: {
                        user_id: targetUserId,
                        company_id,
                    },
                });

                return reply.status(200).send({
                    message: 'Usuário removido com sucesso.',
                });
            },
        );
}