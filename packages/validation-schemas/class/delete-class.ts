import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const DeleteClassFormSchema = z.object({
    id: z.string().uuid('ID da turma inválido'),
})

// ===== API SCHEMAS (Backend Validation) =====
export const DeleteClassApiRequestSchema = z.object({
    id: z.string().uuid(),
})

export const DeleteClassApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type DeleteClassRequestType = z.infer<typeof DeleteClassApiRequestSchema>
export type DeleteClassResponseType = z.infer<typeof DeleteClassApiResponseSchema>
