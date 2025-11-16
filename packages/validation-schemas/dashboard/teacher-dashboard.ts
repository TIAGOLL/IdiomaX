import { z } from 'zod'

// API Schema para requisição na API
export const TeacherDashboardApiRequestSchema = z.object({
    company_id: z.string().uuid(),
    user_id: z.string().uuid(),
})

// API Schema para resposta da API
export const TeacherDashboardApiResponseSchema = z.object({
    myClasses: z.array(z.object({
        id: z.string(),
        name: z.string(),
        courseName: z.string(),
        studentsCount: z.number(),
        vacancies: z.number(),
    })),
    totalStudents: z.number(), // Total de alunos nas turmas do professor
    upcomingLessons: z.number(), // Quantidade de aulas programadas nos próximos 7 dias
    scheduledClasses: z.array(z.object({
        id: z.string(),
        title: z.string(), // Nome da turma
        start: z.date(),
        end: z.date(),
        className: z.string(),
        courseName: z.string(),
    })),
})

export type TeacherDashboardApiRequest = z.infer<typeof TeacherDashboardApiRequestSchema>
export type TeacherDashboardApiResponse = z.infer<typeof TeacherDashboardApiResponseSchema>
