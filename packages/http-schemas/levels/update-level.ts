import { z } from 'zod'

export const UpdateLevelFormSchema = z.object({
    id: z.string().uuid(),
    company_id: z.string().uuid(),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    level: z.number().min(1, 'Level deve ser maior que 0'),
    active: z.boolean().optional(),
    disciplines: z.array(z.object({
        id: z.string().uuid().optional(),
        name: z.string().min(2, 'Nome da disciplina deve ter pelo menos 2 caracteres'),
        active: z.boolean().optional()
    })).min(1, 'Pelo menos uma disciplina é obrigatória')
})

export const UpdateLevelApiRequestSchema = UpdateLevelFormSchema

export const UpdateLevelApiResponseSchema = z.object({
    message: z.string(),
    level: z.object({
        id: z.string(),
        name: z.string(),
        level: z.number(),
        courses_id: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        active: z.boolean(),
        disciplines: z.array(z.object({
            id: z.string(),
            name: z.string(),
            levels_id: z.string(),
            created_at: z.string(),
            updated_at: z.string(),
            active: z.boolean()
        }))
    })
})

export type UpdateLevelFormData = z.infer<typeof UpdateLevelFormSchema>
export type UpdateLevelRequest = z.infer<typeof UpdateLevelApiRequestSchema>
export type UpdateLevelResponse = z.infer<typeof UpdateLevelApiResponseSchema>