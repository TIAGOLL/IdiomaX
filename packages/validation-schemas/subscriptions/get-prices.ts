import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
// Schemas com mensagens de erro traduzidas para o usuário
export const GetPricesFormSchema = z.object({
    active: z.boolean().optional(),
    limit: z.number().min(1, 'Limite deve ser maior que 0').max(100, 'Limite máximo de 100 preços').default(20),
})

// ===== API SCHEMAS (Backend Validation) =====
// Schemas para validação rigorosa da API
export const GetPricesApiRequestSchema = z.object({
    active: z.boolean().optional(),
    limit: z.number().min(1).max(100).default(20),
})

export const GetPricesApiResponseSchema = z.object({
    prices: z.array(z.object({
        id: z.string(),
        currency: z.string(),
        active: z.boolean(),
        metadata: z.record(z.string(), z.string()),
        unit_amount: z.union([z.bigint(), z.string(), z.number()]).transform(val => val?.toString()),
        product: z.object({
            id: z.string(),
            name: z.string(),
            active: z.boolean(),
            metadata: z.record(z.string(), z.string()),
            description: z.string().nullable(),
        }).optional().nullable(),
        created: z.number(),
        updated: z.number(),
    })),
})

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type GetPricesRequestType = z.infer<typeof GetPricesApiRequestSchema>;
export type GetPricesResponseType = z.infer<typeof GetPricesApiResponseSchema>;