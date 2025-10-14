import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DeleteLessonApiRequestSchema, DeleteLessonApiResponseSchema } from '@idiomax/validation-schemas/lessons/delete-lesson'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { NotFoundError } from '../_errors/not-found-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function deleteLesson(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete('/lesson', {
            schema: {
                tags: ['Lessons'],
                summary: 'Delete a lesson',
                security: [{ bearerAuth: [] }],
                body: DeleteLessonApiRequestSchema,
                response: {
                    200: DeleteLessonApiResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                id,
                company_id
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('delete', 'Lesson')) {
                throw new ForbiddenError()
            }

            // Verificar se a aula existe e pertence à empresa
            const existingLesson = await prisma.lessons.findFirst({
                where: {
                    id: id,
                    active: true,
                    class: {
                        courses: {
                            company_id: company_id
                        }
                    }
                }
            })

            if (!existingLesson) {
                throw new NotFoundError('Aula não encontrada ou não pertence a esta empresa.')
            }

            // Soft delete da aula (marcar como inativa)
            await prisma.classes.update({
                where: {
                    id: id
                },
                data: {
                    active: false,
                    updated_by: userId,
                }
            })

            // Também marcar lista de presença como inativa
            await prisma.presence_lists.updateMany({
                where: {
                    classe_id: id,
                    active: true
                },
                data: {
                    active: false,
                    updated_by: userId,
                }
            })

            return reply.send({
                message: 'Aula deletada com sucesso!',
            })
        })
}