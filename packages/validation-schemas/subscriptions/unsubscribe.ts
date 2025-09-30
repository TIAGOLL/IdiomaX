import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UnsubscribeFormSchema = z.object({
    subscription_id: z.string().min(1),
    company_id: z.string().uuid(),
    cancel_immediately: z.boolean().default(true),
    cancellation_reason: z.string().max(500).optional(),
});

// ===== API SCHEMAS (Backend Validation) =====
export const UnsubscribeApiRequestSchema = z.object({
    subscription_id: z.string().min(1),
    company_id: z.string().uuid(),
    cancel_immediately: z.boolean().default(true).optional(),
    cancellation_reason: z.string().max(500).optional(),
});

export const UnsubscribeApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type UnsubscribeRequestType = z.infer<typeof UnsubscribeApiRequestSchema>;
export type UnsubscribeResponseType = z.infer<typeof UnsubscribeApiResponseSchema>;