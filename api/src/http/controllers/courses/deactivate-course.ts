import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { DeactivateCourseApiRequest, DeactivateCourseApiResponse } from '@idiomax/validation-schemas/courses/deactivate-course';
import { prisma } from '../../../lib/prisma';
import { BadRequestError } from '../_errors/bad-request-error';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function deactivateCourse(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch(
            '/courses/deactivate',
            {
                schema: {
                    tags: ['Courses'],
                    summary: 'Ativar ou desativar um curso via body.',
                    security: [{ bearerAuth: [] }],
                    body: DeactivateCourseApiRequest,
                    response: {
                        200: DeactivateCourseApiResponse,
                    },
                },
            },
            async (request, reply) => {
                const { course_id: targetCourseId, company_id, active } = request.body;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('delete', 'Course')) {
                    throw new ForbiddenError()
                }

                // Verificar se o curso existe e está associado à empresa
                const course = await prisma.courses.findFirst({
                    where: {
                        id: targetCourseId,
                        company_id,
                    }
                });

                if (!course) {
                    throw new BadRequestError(`Curso não encontrado ou não está associado a esta empresa.`);
                }

                // Ativar ou desativar o curso
                await prisma.courses.update({
                    where: { id: targetCourseId },
                    data: {
                        active: active,
                        updated_at: new Date(),
                        updated_by: userId,
                    },
                });

                return reply.status(200).send({
                    message: active ? 'Curso ativado com sucesso.' : 'Curso desativado com sucesso.',
                });
            },
        );
}