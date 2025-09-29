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
    metadata: z.unknown().nullable(),
    quantity: z.number().int().nullable(),
    cancel_at_period_end: z.boolean().nullable(),
    created: z.date(),
    current_period_start: z.date().nullable(),
    current_period_end: z.date().nullable(),
    ended_at: z.date().nullable(),
    cancel_at: z.date().nullable(),
    canceled_at: z.date().nullable(),
    trial_start: z.date().nullable(),
    trial_end: z.date().nullable(),
    company_customer: z.object({
        company_id: z.string(),
        stripe_customer_id: z.string(),
        company: z.object({
            id: z.string(),
            name: z.string(),
            cnpj: z.string(),
            phone: z.string(),
            email: z.string().nullable(),
            logo_16x16_url: z.string().nullable(),
            logo_512x512_url: z.string().nullable(),
            social_reason: z.string().nullable(),
            state_registration: z.string().nullable(),
            tax_regime: z.string().nullable(),
            created_at: z.date(),
            updated_at: z.date(),
            address: z.string(),
            owner_id: z.string(),
            active: z.boolean(),
            created_by: z.string(),
            updated_by: z.string(),
        })
    }),
    price: z.object({
        id: z.string(),
        product_id: z.string(),
        active: z.boolean(),
        description: z.string().nullable(),
        unit_amount: z.union([z.bigint(), z.string(), z.number()]).transform(val => val?.toString()).nullable(),
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