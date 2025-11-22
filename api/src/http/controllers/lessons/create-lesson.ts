import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateLessonApiRequestSchema, CreateLessonApiResponseSchema } from '@idiomax/validation-schemas/lessons/create-lesson'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { BadRequestError } from '../_errors/bad-request-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function createLesson(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/lesson', {
            schema: {
                tags: ['Lessons'],
                summary: 'Create a new lesson',
                security: [{ bearerAuth: [] }],
                body: CreateLessonApiRequestSchema,
                response: {
                    201: CreateLessonApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                company_id,
                theme,
                start_date,
                end_date,
                class_id
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('create', 'Lesson')) {
                throw new ForbiddenError()
            }

            // Validar se data de início é anterior à data de fim
            const startDateTime = new Date(start_date)
            const endDateTime = new Date(end_date)

            if (startDateTime >= endDateTime) {
                throw new BadRequestError('A data/hora de início deve ser anterior à data/hora de fim.')
            }

            // Verificar se há conflito de horários para a mesma turma
            const conflictingLesson = await prisma.lessons.findFirst({
                where: {
                    class_id: class_id,
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


            // Criar a aula e lista de presença em uma transação
            await prisma.$transaction(async (tx) => {
                // Criar a aula
                const createdLesson = await tx.lessons.create({
                    data: {
                        theme,
                        start_date: startDateTime,
                        end_date: endDateTime,
                        class_id,
                        created_by: userId,
                        updated_by: userId,
                    }
                })

                // Buscar todos os alunos da turma (não professores)
                const studentsInClass = await tx.users_in_class.findMany({
                    where: {
                        class_id: class_id,
                        teacher: false
                    }
                })

                // Criar lista de presença para todos os alunos (inicialmente ausentes)
                if (studentsInClass.length > 0) {
                    await tx.presence_lists.createMany({
                        data: studentsInClass.map(student => ({
                            is_present: false,
                            lesson_id: createdLesson.id,
                            user_id: student.user_id,
                            created_by: userId,
                            updated_by: userId,
                        }))
                    })
                }

                return createdLesson
            })

            return reply.status(201).send({
                message: 'Aula criada com sucesso!',
            })
        })
}