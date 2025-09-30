import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { DeleteCourseApiRequest, DeleteCourseApiResponse } from '@idiomax/validation-schemas/courses/delete-course';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { ForbiddenError } from '../_errors/forbidden-error';
import { getUserPermissions } from '../../../lib/get-user-permission';

export async function deleteCourse(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/courses/delete',
            {
                schema: {
                    tags: ['Courses'],
                    summary: 'Deletar um curso permanentemente.',
                    security: [{ bearerAuth: [] }],
                    body: DeleteCourseApiRequest,
                    response: {
                        200: DeleteCourseApiResponse,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, course_id: targetCourseId } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('delete', 'Course')) {
                    throw new ForbiddenError()
                }

                const activeClasses = await prisma.renamedclass.findFirst({
                    where: {
                        course_id: targetCourseId,
                        active: true
                    }
                });

                if (activeClasses) {
                    throw new BadRequestError(`Não é possível deletar o curso pois existem turmas ativas associadas a ele.`);
                }

                // Deletar o curso
                await prisma.courses.delete({
                    where: { id: targetCourseId }
                });

                return reply.status(200).send({
                    message: 'Curso deletado com sucesso.',
                });
            },
        );
}