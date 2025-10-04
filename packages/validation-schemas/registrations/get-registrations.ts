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
    monthly_fee_amount: z.number(),
    locked: z.boolean().nullable(),
    completed: z.boolean().nullable(),
    user_id: z.string().nullable(),
    company_id: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    active: z.boolean(),
    users: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    }).nullable().optional(),
});

export const GetRegistrationsApiResponseSchema = z.array(RegistrationResponseSchema);

export const GetRegistrationByIdApiResponseSchema = RegistrationResponseSchema;

// ===== HTTP TYPES (Frontend Services) =====
export type GetRegistrationsRequestType = z.infer<typeof GetRegistrationsApiRequestSchema>;
export type GetRegistrationsResponseType = z.infer<typeof GetRegistrationsApiResponseSchema>;
export type GetRegistrationByIdRequestType = z.infer<typeof GetRegistrationByIdApiRequestSchema>;
export type GetRegistrationByIdResponseType = z.infer<typeof GetRegistrationByIdApiResponseSchema>;