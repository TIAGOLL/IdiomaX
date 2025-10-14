import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { RemoveUserInClassApiRequestSchema, RemoveUserInClassApiResponseSchema } from '@idiomax/validation-schemas/class/remove-user-in-class';
import { prisma } from '../../../services/prisma';
import { auth } from '../../../middlewares/auth';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { ErrorResponseSchema } from '../../../types/error-response-schema';

export async function removeUserInClass(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete('/user-in-class', {
            schema: {
                tags: ['Class'],
                summary: 'Remover usuário de uma turma',
                security: [{ bearerAuth: [] }],
                body: RemoveUserInClassApiRequestSchema,
                response: {
                    200: RemoveUserInClassApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                user_in_class_id,
                company_id
            } = request.body;

            const userId = await request.getCurrentUserId();
            const { member } = await request.getUserMember(company_id);
            const { cannot } = getUserPermissions(userId, member.role);

            if (cannot('delete', 'Class')) {
                throw new ForbiddenError();
            }

            // Remover usuário da turma (soft delete)
            await prisma.users_in_class.delete({
                where: { id: user_in_class_id },
            });

            return reply.status(200).send({
                message: 'Usuário removido da turma com sucesso!'
            });
        });
}