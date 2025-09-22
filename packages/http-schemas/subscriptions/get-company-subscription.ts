import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const GetCompanySubscriptionFormSchema = z.object({
    companyId: z.string()
        .uuid('ID da empresa é obrigatório'),
});

// ===== API SCHEMAS (Backend Validation) =====
export const GetCompanySubscriptionApiRequestSchema = z.object({
    company_id: z.string().uuid(),
});

export const GetCompanySubscriptionApiResponseSchema = z.object({
    subscription: z.object({
        id: z.string(),
        status: z.enum(['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid']),
        current_period_start: z.number(),
        current_period_end: z.number(),
        cancel_at_period_end: z.boolean(),
        canceled_at: z.number().nullable(),
        created: z.number(),
        customer: z.object({
            id: z.string(),
            email: z.string().nullable(),
            name: z.string().nullable(),
        }),
        items: z.array(z.object({
            id: z.string(),
            price: z.object({
                id: z.string(),
                currency: z.string(),
                unit_amount: z.number().nullable(),
                recurring: z.object({
                    interval: z.enum(['day', 'week', 'month', 'year']),
                    interval_count: z.number(),
                }).nullable(),
                product: z.object({
                    id: z.string(),
                    name: z.string(),
                    description: z.string().nullable(),
                }),
            }),
            quantity: z.number(),
        })),
    }).nullable(),
    company: z.object({
        id: z.string().uuid(),
        name: z.string(),
        active: z.boolean(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type GetCompanySubscriptionHttpRequest = z.infer<typeof GetCompanySubscriptionApiRequestSchema>;
export type GetCompanySubscriptionHttpResponse = z.infer<typeof GetCompanySubscriptionApiResponseSchema>;