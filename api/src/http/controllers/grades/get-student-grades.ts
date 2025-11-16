import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetStudentGradesApiRequestSchema, GetStudentGradesApiResponseSchema } from '@idiomax/validation-schemas/grades'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'

export async function getStudentGrades(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get('/students/grades', {
            schema: {
                tags: ['Grades'],
                summary: 'Buscar notas do aluno logado',
                security: [{ bearerAuth: [] }],
                querystring: GetStudentGradesApiRequestSchema,
                response: {
                    200: GetStudentGradesApiResponseSchema,
                    403: ErrorResponseSchema
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { company_id } = request.query

            const { member } = await request.getUserMember(company_id)
            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('get', 'Grade')) {
                throw new ForbiddenError('Você não tem permissão para acessar notas')
            }

            // Buscar as turmas do aluno para associar às tasks
            const userClasses = await prisma.users_in_class.findMany({
                where: {
                    user_id: userId,
                    active: true,
                    teacher: false,
                },
                select: {
                    class_id: true,
                    class: {
                        select: {
                            courses: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
            })

            // Mapear course_id → class_id
            const courseToClassMap = new Map<string, string>()
            userClasses.forEach((uc) => {
                courseToClassMap.set(uc.class.courses.id, uc.class_id)
            })

            // Buscar apenas as matrículas do aluno logado
            const registrations = await prisma.registrations.findMany({
                where: {
                    user_id: userId,
                    company_id: company_id,
                    active: true,
                },
                select: {
                    id: true,
                    start_date: true,
                    end_date: true,
                    completed: true,
                    locked: true,
                    course: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            })

            const registrationsWithGrades = await Promise.all(
                registrations.map(async (registration) => {
                    const tasks = await prisma.tasks.findMany({
                        where: {
                            disciplines: {
                                levels: {
                                    course_id: registration.course.id,
                                },
                            },
                            active: true,
                        },
                        select: {
                            id: true,
                            title: true,
                            score: true,
                            due_date: true,
                            disciplines: {
                                select: {
                                    name: true,
                                    levels: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                            tasks_submitted: {
                                where: {
                                    registration_id: registration.id,
                                    active: true,
                                },
                                select: {
                                    id: true,
                                    grade: true,
                                    date: true,
                                },
                            },
                        },
                        orderBy: {
                            due_date: 'asc',
                        },
                    })

                    const classId = courseToClassMap.get(registration.course.id) || ''

                    const grades = tasks.map((task) => {
                        const submission = task.tasks_submitted[0] || null

                        return {
                            task_id: task.id,
                            task_title: task.title,
                            task_value: task.score || 100,
                            discipline_name: task.disciplines.name,
                            level_name: task.disciplines.levels?.name || '',
                            submit_date: (task.due_date || new Date()).toISOString(),
                            grade: submission?.grade || null,
                            submitted_at: submission?.date ? submission.date.toISOString() : null,
                            class_id: classId,
                        }
                    })

                    const completedTasks = grades.filter((g) => g.grade !== null).length
                    const totalGrades = grades.reduce((sum, g) => sum + (g.grade || 0), 0)
                    const average = completedTasks > 0 ? Math.round(totalGrades / completedTasks) : 0

                    return {
                        id: registration.id,
                        course_name: registration.course.name,
                        start_date: registration.start_date.toISOString(),
                        end_date: registration.end_date.toISOString(),
                        completed: registration.completed,
                        locked: registration.locked,
                        grades,
                        average,
                        total_tasks: tasks.length,
                        completed_tasks: completedTasks,
                    }
                }),
            )

            return reply.status(200).send({
                registrations: registrationsWithGrades
            })
        })
}
