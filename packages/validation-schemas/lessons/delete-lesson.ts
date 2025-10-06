import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const DeleteLessonFormSchema = z.object({
    id: z.string().uuid('ID da aula inválido'),
})

// ===== API SCHEMAS (Backend Validation) =====
export const DeleteLessonApiRequestSchema = z.object({
    id: z.string().uuid(),
    company_id: z.string().uuid(),
})

export const DeleteLessonApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type DeleteLessonRequestType = z.infer<typeof DeleteLessonApiRequestSchema>
export type DeleteLessonResponseType = z.infer<typeof DeleteLessonApiResponseSchema>