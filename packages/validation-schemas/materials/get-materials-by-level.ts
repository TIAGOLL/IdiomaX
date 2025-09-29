import { z } from 'zod'

// Form Schema para filtros de busca de livros
export const GetBooksFormSchema = z.object({
    levelId: z.string()
        .uuid({ message: 'ID do nível deve ser um UUID válido.' })
        .optional(),

    page: z.number()
        .int({ message: 'Página deve ser um número inteiro.' })
        .min(1, { message: 'Página deve ser pelo menos 1.' })
        .default(1),

    limit: z.number()
        .int({ message: 'Limite deve ser um número inteiro.' })
        .min(1, { message: 'Limite deve ser pelo menos 1.' })
        .max(100, { message: 'Limite máximo é 100.' })
        .default(10),

    search: z.string()
        .min(1, { message: 'Busca deve ter pelo menos 1 caractere.' })
        .optional(),

    active: z.boolean()
        .optional(),
})

// API Schema para parâmetros na API
export const GetMaterialsByLevelApiParamsSchema = z.object({
    company_id: z.string().uuid(),
})

// API Schema para query na API
export const GetMaterialsByLevelApiQuerySchema = z.object({
    level_id: z.string().uuid().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    active: z.coerce.boolean().optional(),
}).optional()

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
export type GetMaterialsByLevelApiResponseData = z.infer<typeof GetMaterialsByLevelApiResponseSchema>
export type GetMaterialsByLevelApiRequestData = z.infer<typeof GetMaterialsByLevelApiParamsSchema>