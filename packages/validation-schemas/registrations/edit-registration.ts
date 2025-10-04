import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const EditRegistrationFormSchema = z.object({
    monthly_fee_amount: z.number()
        .min(0, 'Valor da mensalidade não pode ser negativo')
        .max(99999.99, 'Valor da mensalidade muito alto'),
    locked: z.boolean().optional().default(false),
    completed: z.boolean().optional().default(false),
});

// ===== API SCHEMAS (Backend Validation) =====
export const EditRegistrationApiRequestSchema = z.object({
    id: z.string().uuid(),
    company_id: z.string().uuid(),
    monthly_fee_amount: z.number().min(0).max(99999.99),
    locked: z.boolean().optional().default(false),
    completed: z.boolean().optional().default(false),
});

export const EditRegistrationApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type EditRegistrationRequestType = z.infer<typeof EditRegistrationApiRequestSchema>;
export type EditRegistrationResponseType = z.infer<typeof EditRegistrationApiResponseSchema>;