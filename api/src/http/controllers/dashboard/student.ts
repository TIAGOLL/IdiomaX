import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { StudentDashboardApiResponseSchema } from '@idiomax/validation-schemas/dashboard/student-dashboard'

export async function StudentDashboard(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/student-dashboard/:company_id',
            {
                schema: {
                    tags: ['Dashboard'],
                    summary: 'Dashboard do estudante',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        company_id: z.string().uuid(),
                    }),
                    response: {
                        200: StudentDashboardApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.params
                const userId = await request.getCurrentUserId()

                // Buscar matrículas ativas do estudante
                const registrations = await prisma.registrations.findMany({
                    where: {
                        company_id: company_id,
                        user_id: userId,
                        active: true,
                    },
                    include: {
                        records_of_students: true,
                        course: {
                            include: {
                                levels: true,
                                classes: {
                                    include: {
                                        class_days: true,
                                    },
                                },
                            },
                        },
                    },
                })

                if (registrations.length === 0) {
                    return reply.status(200).send({
                        attendanceRate: 0,
                        pendingTasks: 0,
                        completedLevels: 0,
                        upcomingClasses: [],
                    })
                }

                // Calcular taxa de presença
                let totalPresences = 0
                let totalMeetings = 0

                for (const registration of registrations) {
                    const presences = registration.records_of_students.filter(
                        (record: any) => record.present,
                    ).length
                    totalPresences += presences
                    totalMeetings += registration.records_of_students.length
                }

                const attendanceRate =
                    totalMeetings > 0
                        ? Math.round((totalPresences / totalMeetings) * 100)
                        : 0

                // Buscar atividades pendentes do usuário
                // Contar todas as tasks das disciplinas dos cursos do aluno
                const courseIds = registrations.map((r) => r.course_id)

                const allTasks = await prisma.tasks.count({
                    where: {
                        disciplines: {
                            levels: {
                                course_id: {
                                    in: courseIds,
                                },
                            },
                        },
                    },
                })

                // Contar tasks já submetidas
                const submittedTasks = await prisma.tasks_submitted.count({
                    where: {
                        registration_id: {
                            in: registrations.map((r) => r.id),
                        },
                    },
                })

                const pendingTasksCount = allTasks - submittedTasks

                // Calcular níveis finalizados - simplificado
                // Vamos contar quantos cursos foram completados
                const completedLevelsCount = await prisma.registrations.count({
                    where: {
                        user_id: userId,
                        company_id: company_id,
                        completed: true,
                    },
                })

                // Montar próximas aulas
                const upcomingClasses = []
                const now = new Date()
                const diasSemana: Record<string, string> = {
                    SEGUNDA: 'Segunda',
                    TERCA: 'Terça',
                    QUARTA: 'Quarta',
                    QUINTA: 'Quinta',
                    SEXTA: 'Sexta',
                    SABADO: 'Sábado',
                    DOMINGO: 'Domingo',
                }

                const daysOfWeekMap: Record<string, number> = {
                    DOMINGO: 0,
                    SEGUNDA: 1,
                    TERCA: 2,
                    QUARTA: 3,
                    QUINTA: 4,
                    SEXTA: 5,
                    SABADO: 6,
                }

                for (const registration of registrations) {
                    if (!registration.course || !registration.course.classes) continue

                    for (const classItem of registration.course.classes) {
                        for (const classDay of classItem.class_days) {
                            const startTime = new Date(classDay.start_time)
                            const endTime = new Date(classDay.end_time)

                            // Calcular próxima ocorrência desta aula
                            const dayOfWeek = daysOfWeekMap[classDay.week_date]
                            let nextDate = new Date(now)
                            nextDate.setDate(
                                now.getDate() + ((dayOfWeek + 7 - now.getDay()) % 7),
                            )
                            nextDate.setHours(
                                startTime.getHours(),
                                startTime.getMinutes(),
                                0,
                                0,
                            )

                            // Se a próxima data já passou hoje, pegar a da próxima semana
                            if (nextDate <= now) {
                                nextDate.setDate(nextDate.getDate() + 7)
                            }

                            const pad = (n: number) => n.toString().padStart(2, '0')
                            const startTimeStr = `${pad(startTime.getHours())}:${pad(startTime.getMinutes())}`
                            const endTimeStr = `${pad(endTime.getHours())}:${pad(endTime.getMinutes())}`

                            upcomingClasses.push({
                                id: classDay.id,
                                className: classItem.name,
                                courseName: registration.course.name,
                                dayOfWeek: diasSemana[classDay.week_date],
                                startTime: startTimeStr,
                                endTime: endTimeStr,
                                nextDate,
                            })
                        }
                    }
                }

                // Ordenar por próxima data
                upcomingClasses.sort(
                    (a, b) => a.nextDate.getTime() - b.nextDate.getTime(),
                )

                return reply.status(200).send({
                    attendanceRate,
                    pendingTasks: pendingTasksCount,
                    completedLevels: completedLevelsCount,
                    upcomingClasses: upcomingClasses.slice(0, 10), // Limitar a 10 próximas aulas
                })
            },
        )
}

