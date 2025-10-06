import { z } from 'zod';

// ===== API SCHEMAS (Backend Validation) =====
export const GetRegistrationsApiRequestSchema = z.object({
    company_id: z.string().uuid('ID da empresa deve ser um UUID válido'),
});

export const GetRegistrationByIdApiRequestSchema = z.object({
    id: z.string().uuid('ID da inscrição deve ser um UUID válido'),
    company_id: z.string().uuid('ID da empresa deve ser um UUID válido'),
});

// Schema para o objeto de resposta de uma inscrição individual
export const RegistrationResponseSchema = z.object({
    id: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    discount_payment_before_due_date: z.number(),
    monthly_fee_amount: z.number(),
    locked: z.boolean(),
    completed: z.boolean(),
    user_id: z.string(),
    company_id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    active: z.boolean(),
    users: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    }),
    has_overdue_payments: z.boolean(),
    total_overdue_amount: z.number(),
    overdue_payments_count: z.number(),
});

export const GetRegistrationsApiResponseSchema = z.array(RegistrationResponseSchema);

export const GetRegistrationByIdApiResponseSchema = RegistrationResponseSchema;

// ===== HTTP TYPES (Frontend Services) =====
export type GetRegistrationsRequestType = z.infer<typeof GetRegistrationsApiRequestSchema>;
export type GetRegistrationsResponseType = z.infer<typeof GetRegistrationsApiResponseSchema>;
export type GetRegistrationByIdRequestType = z.infer<typeof GetRegistrationByIdApiRequestSchema>;
export type GetRegistrationByIdResponseType = z.infer<typeof GetRegistrationByIdApiResponseSchema>;