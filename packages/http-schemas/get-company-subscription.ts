import z from "zod";

export const getCompanySubscriptionResponse = z.object({
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
    price_id: z.string(),
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
});


export const getCompanySubscriptionParams = z.object({
    companyId: z.string(),
});