import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateClassFormSchema = z.object({
    name: z.string().min(1, 'Nome da turma é obrigatório').max(256, 'Nome muito longo'),
    vacancies: z.number().min(0, 'Vagas não pode ser negativo').int('Vagas deve ser um número inteiro'),
})

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateClassApiRequestSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(256),
    vacancies: z.number().min(0).int(),
    updated_by: z.string().nullable().optional(),
})

export const UpdateClassApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateClassRequestType = z.infer<typeof UpdateClassApiRequestSchema>
export type UpdateClassResponseType = z.infer<typeof UpdateClassApiResponseSchema>
