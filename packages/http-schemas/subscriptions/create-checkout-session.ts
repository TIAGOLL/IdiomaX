import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateCheckoutSessionFormSchema = z.object({
    priceId: z.string()
        .min(1, 'Selecione um plano')
        .startsWith('price_', 'ID de preço inválido'),
    url: z.string()
        .url('URL de sucesso inválida')
        .optional(),
});

// ===== API SCHEMAS (Backend Validation) =====
export const CreateCheckoutSessionApiRequestSchema = z.object({
    price_id: z.string().min(1),
    company_id: z.string().uuid(),
    user_id: z.string().uuid(),
    success_url: z.string().url().optional(),
    cancel_url: z.string().url().optional(),
    mode: z.enum(['payment', 'subscription']).default('subscription'),
});

export const CreateCheckoutSessionApiResponseSchema = z.object({
    checkout_url: z.string().url(),
    session_id: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type CreateCheckoutSessionHttpRequest = z.infer<typeof CreateCheckoutSessionApiRequestSchema>;
export type CreateCheckoutSessionHttpResponse = z.infer<typeof CreateCheckoutSessionApiResponseSchema>;