import { z } from 'zod'

export const GetLevelByIdApiParamsSchema = z.object({
    level_id: z.string().uuid('ID do level inválido')
})

export const GetLevelByIdApiResponseSchema = z.object({
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

export type GetLevelByIdParams = z.infer<typeof GetLevelByIdApiParamsSchema>
export type GetLevelByIdResponse = z.infer<typeof GetLevelByIdApiResponseSchema>