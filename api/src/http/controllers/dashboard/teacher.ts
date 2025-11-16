import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { TeacherDashboardApiResponseSchema } from '@idiomax/validation-schemas/dashboard/teacher-dashboard'

export async function TeacherDashboard(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/teacher-dashboard/:company_id',
            {
                schema: {
                    tags: ['Dashboard'],
                    summary: 'Dashboard do professor filtrada por empresa',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        company_id: z.string().uuid(),
                    }),
                    response: {
                        200: TeacherDashboardApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.params
                const userId = await request.getCurrentUserId()

                // Buscar turmas onde o usuário é professor
                const teacherClasses = await prisma.users_in_class.findMany({
                    where: {
                        user_id: userId,
                        teacher: true,
                        active: true,
                        class: {
                            active: true,
                            courses: {
                                company_id: company_id,
                            },
                        },
                    },
                    include: {
                        class: {
                            include: {
                                courses: true,
                                users_in_class: {
                                    where: {
                                        teacher: false,
                                        active: true,
                                    },
                                },
                                class_days: true,
                            },
                        },
                    },
                })

                if (teacherClasses.length === 0) {
                    return reply.status(200).send({
                        myClasses: [],
                        totalStudents: 0,
                        upcomingLessons: 0,
                        scheduledClasses: [],
                    })
                }

                // Montar informações das turmas
                const myClasses = teacherClasses.map((tc) => ({
                    id: tc.class.id,
                    name: tc.class.name,
                    courseName: tc.class.courses.name,
                    studentsCount: tc.class.users_in_class.length,
                    vacancies: tc.class.vacancies,
                }))

                // Calcular total de alunos
                const totalStudents = teacherClasses.reduce(
                    (sum, tc) => sum + tc.class.users_in_class.length,
                    0,
                )

                // Calcular aulas dos próximos 7 dias
                const now = new Date()
                const sevenDaysLater = new Date()
                sevenDaysLater.setDate(now.getDate() + 7)

                const daysOfWeekMap: Record<string, number> = {
                    DOMINGO: 0,
                    SEGUNDA: 1,
                    TERCA: 2,
                    QUARTA: 3,
                    QUINTA: 4,
                    SEXTA: 5,
                    SABADO: 6,
                }

                let upcomingLessonsCount = 0
                const scheduledClasses = []

                for (const tc of teacherClasses) {
                    for (const classDay of tc.class.class_days) {
                        const startTime = new Date(classDay.start_time)
                        const endTime = new Date(classDay.end_time)
                        const dayOfWeek = daysOfWeekMap[classDay.week_date]

                        // Gerar todas as ocorrências dos próximos 7 dias
                        let checkDate = new Date(now)
                        checkDate.setHours(0, 0, 0, 0)

                        for (let i = 0; i < 7; i++) {
                            if (checkDate.getDay() === dayOfWeek) {
                                const classStart = new Date(checkDate)
                                classStart.setHours(
                                    startTime.getHours(),
                                    startTime.getMinutes(),
                                    0,
                                    0,
                                )

                                const classEnd = new Date(checkDate)
                                classEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0)

                                if (classStart >= now && classStart <= sevenDaysLater) {
                                    upcomingLessonsCount++
                                    scheduledClasses.push({
                                        id: `${classDay.id}-${classStart.toISOString()}`,
                                        title: tc.class.name,
                                        start: classStart,
                                        end: classEnd,
                                        className: tc.class.name,
                                        courseName: tc.class.courses.name,
                                    })
                                }
                            }
                            checkDate.setDate(checkDate.getDate() + 1)
                        }
                    }
                }

                // Ordenar aulas agendadas por data
                scheduledClasses.sort((a, b) => a.start.getTime() - b.start.getTime())

                return reply.status(200).send({
                    myClasses,
                    totalStudents,
                    upcomingLessons: upcomingLessonsCount,
                    scheduledClasses,
                })
            },
        )
}
