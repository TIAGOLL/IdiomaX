import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const GetProductsFormSchema = z.object({
    active: z.boolean()
        .optional(),
    limit: z.number()
        .min(1, 'Limite deve ser maior que 0')
        .max(100, 'Limite máximo de 100 produtos')
        .default(20),
});

// ===== API SCHEMAS (Backend Validation) =====
export const GetProductsApiRequestSchema = z.object({
    active: z.boolean().optional(),
    limit: z.number().min(1).max(100).default(20),
});

export const GetProductsApiResponseSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    active: z.boolean(),
    metadata: z.record(z.string(), z.string()).nullable(),
    prices: z.array(z.object({
        id: z.string(),
        currency: z.string(),
        unit_amount: z.number(),
        recurring: z.object({
            interval: z.enum(['day', 'week', 'month', 'year']),
            interval_count: z.number(),
        }).nullable(),
        active: z.boolean(),
        metadata: z.record(z.string(), z.string()).nullable(),
    })),
}));

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type GetProductsRequestType = z.infer<typeof GetProductsApiRequestSchema>;
export type GetProductsResponseType = z.infer<typeof GetProductsApiResponseSchema>;