import { z } from 'zod'

// API Schema para parâmetros na API
export const GetMaterialsByLevelApiRequestSchema = z.object({
    level_id: z.string().uuid().optional(),
    company_id: z.string().uuid(),
})

// API Schema para resposta da API
export const GetMaterialsByLevelApiResponseSchema = z.array(
    z.object({
        id: z.string().uuid(),
        name: z.string(),
        file_url: z.string().url().optional().nullable(),
        description: z.string().nullable(),
        level_id: z.string().uuid(),
        active: z.boolean(),
        created_at: z.date(),
        updated_at: z.date(),
        created_by: z.string(),
        updated_by: z.string(),
    })
)

// Types
export type GetMaterialsByLevelResponseType = z.infer<typeof GetMaterialsByLevelApiResponseSchema>
export type GetMaterialsByLevelRequestType = z.infer<typeof GetMaterialsByLevelApiRequestSchema>