import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateSubscriptionFormSchema = z.object({
    priceId: z.string()
        .min(1, 'Selecione um plano')
        .startsWith('price_', 'ID de preço inválido'),
    companyId: z.string()
        .uuid('ID da empresa inválido')
        .optional(),
    userId: z.string()
        .uuid('ID do usuário inválido')
        .optional(),
});

// ===== API SCHEMAS (Backend Validation) =====
export const CreateSubscriptionApiRequestSchema = z.object({
    price_id: z.string().min(1),
    company_id: z.string().uuid(),
});

export const CreateSubscriptionApiResponseSchema = z.object({
    message: z.string(),
    subscription_id: z.string(),
    status: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type CreateSubscriptionRequestType = z.infer<typeof CreateSubscriptionApiRequestSchema>;
export type CreateSubscriptionResponseType = z.infer<typeof CreateSubscriptionApiResponseSchema>;