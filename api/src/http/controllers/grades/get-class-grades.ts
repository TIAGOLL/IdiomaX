import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetClassGradesApiRequestSchema, GetClassGradesApiResponseSchema } from '@idiomax/validation-schemas/grades'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { NotFoundError } from '../_errors/not-found-error'
import { ForbiddenError } from '../_errors/forbidden-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'

export async function getClassGrades(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get('/classes/:class_id/grades', {
            schema: {
                tags: ['Grades'],
                summary: 'Buscar notas de todos os alunos de uma turma',
                security: [{ bearerAuth: [] }],
                params: GetClassGradesApiRequestSchema.pick({ class_id: true }),
                querystring: GetClassGradesApiRequestSchema.pick({ company_id: true }),
                response: {
                    200: GetClassGradesApiResponseSchema,
                    404: ErrorResponseSchema,
                    403: ErrorResponseSchema
                },
            },
        }, async (request, reply) => {
            const { class_id } = request.params
            const { company_id } = request.query

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('get', 'Grade')) {
                throw new ForbiddenError('Você não tem permissão para acessar notas')
            }

            const classData = await prisma.classes.findUnique({
                where: { id: class_id, active: true },
                include: {
                    courses: {
                        select: {
                            id: true,
                            name: true,
                            company_id: true,
                        },
                    },
                },
            })

            if (!classData) {
                throw new NotFoundError('Turma não encontrada')
            }

            if (classData.courses.company_id !== company_id) {
                throw new ForbiddenError('Você não tem permissão para acessar esta turma')
            }

            const studentsInClass = await prisma.users_in_class.findMany({
                where: {
                    class_id: class_id,
                    teacher: false,
                    active: true,
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            })

            const studentsWithGrades = await Promise.all(
                studentsInClass.map(async (studentInClass) => {
                    const registration = await prisma.registrations.findFirst({
                        where: {
                            user_id: studentInClass.user_id,
                            course_id: classData.courses.id,
                            company_id: company_id,
                            active: true,
                        },
                    })

                    if (!registration) {
                        return {
                            id: studentInClass.users.id,
                            name: studentInClass.users.name,
                            email: studentInClass.users.email,
                            registration_id: '',
                            grades: [],
                            average: 0,
                            total_tasks: 0,
                            completed_tasks: 0,
                        }
                    }

                    const tasks = await prisma.tasks.findMany({
                        where: {
                            disciplines: {
                                levels: {
                                    course_id: classData.courses.id,
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
                            created_at: 'asc',
                        },
                    })

                    const grades = tasks.map((task) => {
                        const submission = task.tasks_submitted[0] || null

                        return {
                            task_id: task.id,
                            task_title: task.title,
                            task_value: task.score || 100,
                            discipline_name: task.disciplines.name,
                            level_name: task.disciplines.levels?.name || '',
                            submit_date: (task.due_date || new Date()).toISOString(),
                            submission_id: submission?.id || null,
                            grade: submission?.grade || null,
                            submitted_at: submission?.date ? submission.date.toISOString() : null,
                        }
                    })

                    const completedTasks = grades.filter((g) => g.grade !== null).length
                    const totalGrades = grades.reduce((sum, g) => sum + (g.grade || 0), 0)
                    const average = completedTasks > 0 ? Math.round(totalGrades / completedTasks) : 0

                    return {
                        id: studentInClass.users.id,
                        name: studentInClass.users.name,
                        email: studentInClass.users.email,
                        registration_id: registration.id,
                        grades,
                        average,
                        total_tasks: tasks.length,
                        completed_tasks: completedTasks,
                    }
                }),
            )

            return reply.status(200).send({
                class: {
                    id: classData.id,
                    name: classData.name,
                    course_name: classData.courses.name,
                },
                students: studentsWithGrades,
            })
        })
}
