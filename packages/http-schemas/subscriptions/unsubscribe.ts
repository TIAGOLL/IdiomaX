import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UnsubscribeFormSchema = z.object({
    subscriptionId: z.string()
        .min(1, 'ID da assinatura é obrigatório')
        .startsWith('sub_', 'ID de assinatura inválido'),
    reason: z.string()
        .max(500, 'Motivo muito longo')
        .optional(),
    cancelImmediately: z.boolean()
        .default(false),
});

// ===== API SCHEMAS (Backend Validation) =====
export const UnsubscribeApiRequestSchema = z.object({
    subscription_id: z.string().min(1),
    company_id: z.string().uuid(),
    cancel_immediately: z.boolean().default(false),
    cancellation_reason: z.string().max(500).optional(),
});

export const UnsubscribeApiResponseSchema = z.object({
    message: z.string(),
    subscription: z.object({
        id: z.string(),
        status: z.string(),
        cancel_at_period_end: z.boolean(),
        canceled_at: z.number().nullable(),
        current_period_end: z.number(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type UnsubscribeHttpRequest = z.infer<typeof UnsubscribeApiRequestSchema>;
export type UnsubscribeHttpResponse = z.infer<typeof UnsubscribeApiResponseSchema>;