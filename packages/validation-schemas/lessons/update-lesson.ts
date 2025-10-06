import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateLessonFormSchema = z.object({
    theme: z.string()
        .min(1, 'Tema da aula é obrigatório')
        .max(256, 'Tema muito longo')
        .trim(),
    start_date: z.date({
        message: 'Data de início é obrigatória'
    }),
    end_date: z.date({
        message: 'Data de fim é obrigatória'
    }),
}).refine(
    (data) => data.end_date > data.start_date,
    {
        message: 'Data de fim deve ser posterior à data de início',
        path: ['end_date']
    }
)

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateLessonApiRequestSchema = z.object({
    id: z.string().uuid(),
    theme: z.string().min(1).max(256).trim(),
    start_date: z.string().datetime().or(z.date()),
    end_date: z.string().datetime().or(z.date()),
    company_id: z.string().uuid(),
})

export const UpdateLessonApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateLessonRequestType = z.infer<typeof UpdateLessonApiRequestSchema>
export type UpdateLessonResponseType = z.infer<typeof UpdateLessonApiResponseSchema>