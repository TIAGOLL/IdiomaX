import { z } from 'zod'

export const updateUserRoleRequestSchema = z.object({
    userId: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
    companyId: z.string().uuid(),
})

export const updateUserRoleResponseSchema = z.object({
    message: z.string(),
})

export type UpdateUserRoleRequest = z.infer<typeof updateUserRoleRequestSchema>
export type UpdateUserRoleResponse = z.infer<typeof updateUserRoleResponseSchema>