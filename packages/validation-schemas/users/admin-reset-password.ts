import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const AdminResetPasswordFormSchema = z.object({
    password: z.string()
        .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
        .max(1024, 'Nova senha muito longa'),
    confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
    message: 'Senhas não coincidem',
    path: ['confirm_password']
});

// ===== API SCHEMAS (Backend Validation) =====
export const AdminResetPasswordApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    password: z.string().min(6).max(1024),
});

export const AdminResetPasswordApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type AdminResetPasswordRequestType = z.infer<typeof AdminResetPasswordApiRequestSchema>;
export type AdminResetPasswordResponseType = z.infer<typeof AdminResetPasswordApiResponseSchema>;