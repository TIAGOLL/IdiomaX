import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateLessonFormSchema = z.object({
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
    class_id: z.string().uuid('ID da turma inválido'),
}).refine(
    (data) => data.end_date > data.start_date,
    {
        message: 'Data de fim deve ser posterior à data de início',
        path: ['end_date']
    }
)

// ===== API SCHEMAS (Backend Validation) =====
export const CreateLessonApiRequestSchema = z.object({
    theme: z.string().min(1).max(256).trim(),
    start_date: z.string().datetime().or(z.date()),
    end_date: z.string().datetime().or(z.date()),
    class_id: z.string().uuid(),
    company_id: z.string().uuid(),
})

export const CreateLessonApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type CreateLessonRequestType = z.infer<typeof CreateLessonApiRequestSchema>
export type CreateLessonResponseType = z.infer<typeof CreateLessonApiResponseSchema>