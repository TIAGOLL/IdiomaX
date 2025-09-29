import { z } from 'zod'

export const UpdateLevelFormSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    level: z.number().min(1, 'Level deve ser maior que 0'),
    active: z.boolean().optional(),
})

export const UpdateLevelApiRequestSchema = z.object({
    course_id: z.string(),
    company_id: z.string(),
    name: z.string(),
    level: z.number(),
    active: z.boolean().optional(),
})

export const UpdateLevelApiResponseSchema = z.object({
    message: z.string(),
})

export type UpdateLevelFormData = z.infer<typeof UpdateLevelFormSchema>
export type UpdateLevelRequest = z.infer<typeof UpdateLevelApiRequestSchema>
export type UpdateLevelResponse = z.infer<typeof UpdateLevelApiResponseSchema>