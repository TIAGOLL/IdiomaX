import { z } from 'zod'

// API Schema para requisição na API
export const StudentDashboardApiRequestSchema = z.object({
    company_id: z.string().uuid(),
    user_id: z.string().uuid(),
})

// API Schema para resposta da API
export const StudentDashboardApiResponseSchema = z.object({
    attendanceRate: z.number(), // Taxa de presença em porcentagem
    pendingTasks: z.number(), // Quantidade de atividades pendentes
    completedLevels: z.number(), // Quantidade de níveis finalizados
    upcomingClasses: z.array(z.object({
        id: z.string(),
        className: z.string(),
        courseName: z.string(),
        dayOfWeek: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        nextDate: z.date(),
    })),
})

export type StudentDashboardApiRequest = z.infer<typeof StudentDashboardApiRequestSchema>
export type StudentDashboardApiResponse = z.infer<typeof StudentDashboardApiResponseSchema>
