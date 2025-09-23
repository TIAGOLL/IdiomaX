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
    id: z.string(),
    company_customer_id: z.string(),
    status: z.enum([
        'trialing',
        'active',
        'canceled',
        'incomplete',
        'incomplete_expired',
        'past_due',
        'unpaid'
    ]),
    metadata: z.unknown().optional(),
    quantity: z.number().int().optional(),
    cancel_at_period_end: z.boolean().optional().nullable(),
    created: z.date(),
    current_period_start: z.date().optional().nullable(),
    current_period_end: z.date().optional().nullable(),
    ended_at: z.date().optional().nullable(),
    cancel_at: z.date().optional().nullable(),
    canceled_at: z.date().optional().nullable(),
    trial_start: z.date().optional().nullable(),
    trial_end: z.date().optional().nullable(),
    company_customer: z.object({
        company_id: z.string(),
        stripe_customer_id: z.string(),
        company: z.object({
            id: z.string(),
            name: z.string(),
            cnpj: z.string(),
            phone: z.string(),
            email: z.string().optional().nullable(),
            logo_16x16_url: z.string().optional().nullable(),
            logo_512x512_url: z.string().optional().nullable(),
            social_reason: z.string().optional().nullable(),
            state_registration: z.string().optional().nullable(),
            tax_regime: z.string().optional().nullable(),
            created_at: z.date().optional().nullable(),
            updated_at: z.date().optional().nullable(),
            address: z.string(),
            owner_id: z.string()
        })
    }),
    price: z.object({
        id: z.string(),
        product_id: z.string(),
        active: z.boolean(),
        description: z.string().nullable(),
        unit_amount: z.union([z.bigint(), z.string(), z.number()]).transform(val => val?.toString()),
        currency: z.string(),
        type: z.enum(["one_time", "recurring"]),
        interval: z.enum(["day", "week", "month", "year"]).nullable(),
        interval_count: z.number().nullable(),
        trial_period_days: z.number().nullable(),
        metadata: z.unknown().nullable(),
        product: z.object({
            id: z.string(),
            active: z.boolean(),
            name: z.string(),
            description: z.string().nullable(),
            image: z.string().nullable(),
            metadata: z.unknown().nullable(),
        })
    })
});

// ===== HTTP TYPES (Frontend Services) =====
export type GetCompanySubscriptionHttpRequest = z.infer<typeof GetCompanySubscriptionApiRequestSchema>;
export type GetCompanySubscriptionHttpResponse = z.infer<typeof GetCompanySubscriptionApiResponseSchema>;