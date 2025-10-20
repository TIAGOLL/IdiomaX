import { z } from 'zod';

// ===== 1. FORM SCHEMAS (Frontend Formulários) =====
export const RegisterMonthlyFeePaymentFormSchema = z.object({
    monthly_fee_id: z.string().uuid('ID da mensalidade inválido'),
    registration_id: z.string().uuid('ID da matrícula inválido'),
    paid_amount: z.number({
        error: 'Valor do pagamento é obrigatório',
    }).min(0, 'Valor do pagamento não pode ser negativo'),
    payment_method: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH'], {
        error: 'Método de pagamento inválido'
    })
});

// ===== 2. API SCHEMAS (Backend Validation) =====
export const RegisterMonthlyFeePaymentApiRequestSchema = z.object({
    monthly_fee_id: z.string().uuid(),
    registration_id: z.string().uuid(),
    company_id: z.string().uuid(),
    paid_amount: z.number().min(0),
    payment_method: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH'])
});

export const RegisterMonthlyFeePaymentApiResponseSchema = z.object({
    message: z.string(),
});

// ===== 3. HTTP TYPES (Frontend Services) =====
export type RegisterMonthlyFeePaymentRequestType = z.infer<typeof RegisterMonthlyFeePaymentApiRequestSchema>;
export type RegisterMonthlyFeePaymentResponseType = z.infer<typeof RegisterMonthlyFeePaymentApiResponseSchema>;