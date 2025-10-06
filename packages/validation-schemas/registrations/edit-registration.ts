import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const EditRegistrationFormSchema = z.object({
    monthly_fee_amount: z.number({ error: 'O valor da mensalidade deve ser um número' })
        .min(0, 'Valor da mensalidade não pode ser negativo')
        .max(99999.99, 'Valor da mensalidade muito alto'),
    locked: z.boolean().optional(),
    completed: z.boolean().optional(),
    discount_payment_before_due_date: z.number({ error: 'O desconto deve ser um número' })
        .min(0, 'O desconto deve ser maior ou igual a zero')
        .max(99999.99, 'O desconto não pode ser maior que R$ 99.999,99')
});

// ===== API SCHEMAS (Backend Validation) =====
export const EditRegistrationApiRequestSchema = z.object({
    id: z.string().uuid(),
    company_id: z.string().uuid(),
    monthly_fee_amount: z.number().min(0).max(99999.99),
    locked: z.boolean().optional(),
    completed: z.boolean().optional(),
    discount_payment_before_due_date: z.number().min(0).max(99999.99),
});

export const EditRegistrationApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type EditRegistrationRequestType = z.infer<typeof EditRegistrationApiRequestSchema>;
export type EditRegistrationResponseType = z.infer<typeof EditRegistrationApiResponseSchema>;