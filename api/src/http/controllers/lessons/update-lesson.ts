import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateLessonApiRequestSchema, UpdateLessonApiResponseSchema } from '@idiomax/validation-schemas/lessons/update-lesson'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { BadRequestError } from '../_errors/bad-request-error'
import { NotFoundError } from '../_errors/not-found-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function updateLesson(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/lesson', {
            schema: {
                tags: ['Lessons'],
                summary: 'Update a lesson',
                security: [{ bearerAuth: [] }],
                body: UpdateLessonApiRequestSchema,
                response: {
                    200: UpdateLessonApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                id,
                company_id,
                theme,
                start_date,
                end_date
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Lesson')) { 
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
                },
                include: {
                    class: {
                        select: {
                            id: true
                        }
                    }
                }
            })

            if (!existingLesson) {
                throw new NotFoundError('Aula não encontrada ou não pertence a esta empresa.')
            }

            // Validar se data de início é anterior à data de fim
            const startDateTime = new Date(start_date)
            const endDateTime = new Date(end_date)

            if (startDateTime >= endDateTime) {
                throw new BadRequestError('A data/hora de início deve ser anterior à data/hora de fim.')
            }

            // Verificar se há conflito de horários para a mesma turma (excluindo a aula atual)
            const conflictingLesson = await prisma.lessons.findFirst({
                where: {
                    id: { not: id },
                    class_id: existingLesson.class_id,
                    active: true,
                    OR: [
                        {
                            AND: [
                                { start_date: { lte: startDateTime } },
                                { end_date: { gt: startDateTime } }
                            ]
                        },
                        {
                            AND: [
                                { start_date: { lt: endDateTime } },
                                { end_date: { gte: endDateTime } }
                            ]
                        },
                        {
                            AND: [
                                { start_date: { gte: startDateTime } },
                                { end_date: { lte: endDateTime } }
                            ]
                        }
                    ]
                }
            })

            if (conflictingLesson) {
                throw new BadRequestError('Já existe uma aula agendada para este horário nesta turma.')
            }

            // Atualizar a aula
            await prisma.lessons.update({
                where: {
                    id: id
                },
                data: {
                    theme,
                    start_date: startDateTime,
                    end_date: endDateTime,
                    updated_by: userId,
                }
            })

            return reply.send({
                message: 'Aula atualizada com sucesso!',
            })
        })
}