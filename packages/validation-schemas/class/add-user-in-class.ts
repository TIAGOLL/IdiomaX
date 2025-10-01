import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const AddUserInClassFormSchema = z.object({
    user_id: z.string().uuid(),
    teacher: z.boolean(),
})

// ===== API SCHEMAS (Backend Validation) =====
export const AddUserInClassApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    class_id: z.string().uuid(),
    company_id: z.string().uuid(),
    teacher: z.boolean(),
})

export const AddUserInClassApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type AddUserInClassRequestType = z.infer<typeof AddUserInClassApiRequestSchema>
export type AddUserInClassResponseType = z.infer<typeof AddUserInClassApiResponseSchema>
