import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateUserPasswordFormSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Senha atual é obrigatória'),
    newPassword: z.string()
        .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
        .max(1024, 'Nova senha muito longa'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword']
});

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateUserPasswordApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
    current_password: z.string().min(1),
    new_password: z.string().min(6).max(1024),
});

export const UpdateUserPasswordApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateUserPasswordHttpRequest = z.infer<typeof UpdateUserPasswordApiRequestSchema>;
export type UpdateUserPasswordHttpResponse = z.infer<typeof UpdateUserPasswordApiResponseSchema>;