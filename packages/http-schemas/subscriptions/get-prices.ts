import { z } from 'zod'

// API Schema para resposta da API
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

// HTTP Schema para serviços do frontend
export const GetPricesHttpResponseSchema = z.object({
    prices: z.array(z.object({
        id: z.string(),
        currency: z.string(),
        active: z.boolean(),
        metadata: z.record(z.string(), z.string()),
        unitAmount: z.string(),
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

// Types
export type GetPricesApiResponseData = z.infer<typeof GetPricesApiResponseSchema>
export type GetPricesHttpResponseData = z.infer<typeof GetPricesHttpResponseSchema>