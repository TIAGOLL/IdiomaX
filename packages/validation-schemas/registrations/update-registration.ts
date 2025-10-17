import { z } from 'zod';

// ===== 1. FORM SCHEMAS (Frontend Formulários) =====
export const UpdateRegistrationFormSchema = z.object({
    id: z.string().uuid('ID da matrícula inválido'),
    company_id: z.string().uuid('ID da empresa inválido'),
    monthly_fee_amount: z.number({
        error: 'Valor da mensalidade é obrigatório',
    }).min(0, 'Valor da mensalidade não pode ser negativo'),
    discount_payment_before_due_date: z.number({
        error: 'Valor do desconto é obrigatório',
    }).min(0, 'Valor do desconto não pode ser negativo'),
});

// ===== 2. API SCHEMAS (Backend Validation) =====
export const UpdateRegistrationApiRequestSchema = z.object({
    id: z.string().uuid(),
    company_id: z.string().uuid(),
    monthly_fee_amount: z.number().min(0),
    discount_payment_before_due_date: z.number().min(0),
});

export const UpdateRegistrationApiResponseSchema = z.object({
    message: z.string(),
    registration: z.object({
        id: z.string().uuid(),
        company_id: z.string().uuid(),
        monthly_fee_amount: z.number(),
        discount_payment_before_due_date: z.number(),
        updated_at: z.string()
    })
});

// ===== 3. HTTP TYPES (Frontend Services) =====
export type UpdateRegistrationRequestType = z.infer<typeof UpdateRegistrationApiRequestSchema>;
export type UpdateRegistrationResponseType = z.infer<typeof UpdateRegistrationApiResponseSchema>;