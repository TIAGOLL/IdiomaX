import { z } from 'zod';

// ===== 1. API SCHEMAS (Backend Validation) =====
export const GetRegistrationByIdApiRequestSchema = z.object({
    registration_id: z.string().uuid(),
    company_id: z.string().uuid()
});

export const GetRegistrationByIdApiResponseSchema = z.object({
    id: z.string().uuid(),
    company_id: z.string().uuid(),
    user_id: z.string().uuid(),
    course_id: z.string().uuid(),
    completed: z.boolean(),
    locked: z.boolean(),
    start_date: z.string(),
    monthly_fee_amount: z.number(),
    discount_payment_before_due_date: z.number(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
    user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email()
    }),
    course: z.object({
        id: z.string().uuid(),
        name: z.string()
    }),
    monthly_fees: z.array(z.object({
        id: z.string().uuid(),
        registration_id: z.string().uuid(),
        due_date: z.string(),
        amount: z.number(),
        amount_with_discount: z.number(),
        paid_at: z.string().nullable(),
        paid_amount: z.number().nullable(),
        status: z.enum(['PENDING', 'PAID', 'OVERDUE']),
        created_at: z.string()
    }))
});

// ===== 2. HTTP TYPES (Frontend Services) =====
export type GetRegistrationByIdRequestType = z.infer<typeof GetRegistrationByIdApiRequestSchema>;
export type GetRegistrationByIdResponseType = z.infer<typeof GetRegistrationByIdApiResponseSchema>;