import { z } from 'zod'

export const CreateLevelFormSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    level: z.number().min(1, 'Level deve ser maior que 0'),
})

export const CreateLevelApiRequestSchema = z.object({
    companies_id: z.string().uuid(),
    course_id: z.string().uuid(),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    level: z.number().min(1, 'Level deve ser maior que 0'),
})

export const CreateLevelApiResponseSchema = z.object({
    message: z.string()
})

export type CreateLevelFormData = z.infer<typeof CreateLevelFormSchema>
export type CreateLevelRequest = z.infer<typeof CreateLevelApiRequestSchema>
export type CreateLevelResponse = z.infer<typeof CreateLevelApiResponseSchema>