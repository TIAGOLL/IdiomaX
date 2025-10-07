import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { ForbiddenError } from '../_errors/forbidden-error';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { DeleteClassApiRequestSchema, DeleteClassApiResponseSchema } from '@idiomax/validation-schemas/class';
import { BadRequestError } from '../_errors/bad-request-error';

export async function deleteClass(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/class',
            {
                schema: {
                    tags: ['Classes'],
                    summary: 'Deletar uma turma permanentemente.',
                    security: [{ bearerAuth: [] }],
                    body: DeleteClassApiRequestSchema,
                    response: {
                        200: DeleteClassApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, id: targetClassId } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('delete', 'Class')) {
                    throw new ForbiddenError()
                }

                // Verificar se existem users associados à turma
                const usersInClass = await prisma.users_in_class.findFirst({
                    where: { class_id: targetClassId }
                });

                if (usersInClass) {
                    throw new BadRequestError('Não é possível deletar a turma pois existem alunos ou professores associados a ela.');
                }

                // Deletar a turma
                await prisma.classes.delete({
                    where: { id: targetClassId }
                });

                return reply.status(200).send({
                    message: 'Turma deletada com sucesso.',
                });
            },
        );
}