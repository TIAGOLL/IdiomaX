import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateClassFormSchema = z.object({
    name: z.string().min(1, 'Nome da turma é obrigatório').max(256, 'Nome muito longo'),
    vacancies: z.number().min(0, 'Vagas não pode ser negativo').int('Vagas deve ser um número inteiro'),
    course_id: z.string().uuid('ID do curso inválido'),
})

// ===== API SCHEMAS (Backend Validation) =====
export const CreateClassApiRequestSchema = z.object({
    name: z.string().min(1).max(256),
    vacancies: z.number().min(0).int(),
    course_id: z.string().uuid(),
    company_id: z.string(),
})

export const CreateClassApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type CreateClassRequestType = z.infer<typeof CreateClassApiRequestSchema>
export type CreateClassResponseType = z.infer<typeof CreateClassApiResponseSchema>
