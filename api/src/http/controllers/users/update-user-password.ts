import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { UpdateUserPasswordApiRequestSchema, UpdateUserPasswordApiResponseSchema } from '@idiomax/validation-schemas/users/update-user-password';
import { prisma } from '../../../services/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { hash, compare } from 'bcryptjs';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { NotFoundError } from '../_errors/not-found-error';

export async function updateUserPassword(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/users/update-password',
            {
                schema: {
                    tags: ['Usuários'],
                    summary: 'Atualizar senha de um usuário.',
                    security: [{ bearerAuth: [] }],
                    body: UpdateUserPasswordApiRequestSchema,
                    response: {
                        200: UpdateUserPasswordApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { user_id: targetUserId, company_id, current_password, new_password } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('update', 'User')) {
                    throw new ForbiddenError()
                }

                const user = await prisma.users.findFirst({
                    where: {
                        id: targetUserId,
                    },
                    select: {
                        id: true,
                        password: true,
                    },
                });

                if (!user) {
                    throw new NotFoundError(`Usuário não encontrado.`);
                }

                // Verificar senha atual
                const isCurrentPasswordValid = await compare(current_password, user.password);

                if (!isCurrentPasswordValid) {
                    throw new BadRequestError('Senha atual incorreta.');
                }

                // Hash da nova senha
                const hashedNewPassword = await hash(new_password, 6);

                // Atualizar senha
                await prisma.users.update({
                    where: { id: targetUserId },
                    data: {
                        password: hashedNewPassword,
                        updated_at: new Date(),
                    },
                });

                return reply.status(200).send({ message: 'Senha atualizada com sucesso.', });
            },
        );
}