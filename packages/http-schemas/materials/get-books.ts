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
export const GetBooksApiParamsSchema = z.object({
    company_id: z.string().uuid(),
})

// API Schema para query na API
export const GetBooksApiQuerySchema = z.object({
    level_id: z.string().uuid().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    active: z.coerce.boolean().optional(),
}).optional()

// API Schema para resposta da API
export const GetBooksApiResponseSchema = z.object({
    books: z.array(z.object({
        id: z.string().uuid(),
        title: z.string(),
        description: z.string().nullable(),
        level_id: z.string().uuid(),
        company_id: z.string().uuid(),
        active: z.boolean(),
        created_at: z.date(),
        updated_at: z.date(),
    })),
    total_count: z.number(),
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
})

// HTTP Schema para serviços do frontend
export const GetBooksHttpParamsSchema = z.object({
    companyId: z.string(),
})

export const GetBooksHttpQuerySchema = z.object({
    levelId: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
    active: z.boolean().optional(),
})

export const GetBooksHttpResponseSchema = z.object({
    books: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        levelId: z.string(),
        companyId: z.string(),
        active: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })),
    totalCount: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
})

// Types
export type GetBooksFormData = z.infer<typeof GetBooksFormSchema>
export type GetBooksApiParamsData = z.infer<typeof GetBooksApiParamsSchema>
export type GetBooksApiQueryData = z.infer<typeof GetBooksApiQuerySchema>
export type GetBooksApiResponseData = z.infer<typeof GetBooksApiResponseSchema>
export type GetBooksHttpParamsData = z.infer<typeof GetBooksHttpParamsSchema>
export type GetBooksHttpQueryData = z.infer<typeof GetBooksHttpQuerySchema>
export type GetBooksHttpResponseData = z.infer<typeof GetBooksHttpResponseSchema>