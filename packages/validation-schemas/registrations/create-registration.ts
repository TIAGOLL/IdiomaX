import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateRegistrationFormSchema = z.object({
    user_id: z.string()
        .min(1, 'Selecione um estudante')
        .uuid('ID do usuário deve ser um UUID válido'),
    start_date: z.string()
        .min(1, 'Data de início é obrigatória')
        .refine((date) => {
            const parsed = new Date(date);
            return !isNaN(parsed.getTime());
        }, 'Data deve estar em formato válido'),
    monthly_fee_amount: z.number()
        .min(0, 'Valor da mensalidade não pode ser negativo')
        .max(99999.99, 'Valor da mensalidade muito alto'),
    locked: z.boolean().optional().default(false),
    completed: z.boolean().optional().default(false),
});

// ===== API SCHEMAS (Backend Validation) =====
export const CreateRegistrationApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    start_date: z.string().refine((date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
    }),
    monthly_fee_amount: z.number().min(0).max(99999.99),
    locked: z.boolean().optional().default(false),
    completed: z.boolean().optional().default(false),
});

export const CreateRegistrationApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type CreateRegistrationRequestType = z.infer<typeof CreateRegistrationApiRequestSchema>;
export type CreateRegistrationResponseType = z.infer<typeof CreateRegistrationApiResponseSchema>;