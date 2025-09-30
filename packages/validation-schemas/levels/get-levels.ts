import { z } from 'zod'

export const GetLevelsApiRequestSchema = z.object({
    course_id: z.string().uuid('ID do curso inválido'),
    company_id: z.string().uuid('ID da empresa inválido')
})

export const GetLevelsApiResponseSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    active: z.boolean(),
    disciplines: z.array(z.object({
        id: z.string(),
        name: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        active: z.boolean()
    }))
}))

export type GetLevelsRequestType = z.infer<typeof GetLevelsApiRequestSchema>
export type GetLevelsResponseType = z.infer<typeof GetLevelsApiResponseSchema>
export type Level = GetLevelsResponseType[0]