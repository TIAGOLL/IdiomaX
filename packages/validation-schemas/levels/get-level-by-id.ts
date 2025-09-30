import { z } from 'zod'

export const GetLevelByIdApiRequestSchema = z.object({
    level_id: z.string().uuid('ID do level inválido'),
    company_id: z.string().uuid('ID da empresa inválido')
})

export const GetLevelByIdApiResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    level: z.number(),
    course_id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    active: z.boolean(),
    disciplines: z.array(z.object({
        id: z.string(),
        name: z.string(),
        level_id: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        active: z.boolean()
    }))
})

export type GetLevelByIdRequestType = z.infer<typeof GetLevelByIdApiRequestSchema>
export type GetLevelByIdResponseType = z.infer<typeof GetLevelByIdApiResponseSchema>