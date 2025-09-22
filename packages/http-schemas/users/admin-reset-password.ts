import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const AdminResetPasswordFormSchema = z.object({
    userId: z.string()
        .uuid('ID do usuário é obrigatório'),
    newPassword: z.string()
        .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
        .max(1024, 'Nova senha muito longa'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword']
});

// ===== API SCHEMAS (Backend Validation) =====
export const AdminResetPasswordApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
    new_password: z.string().min(6).max(1024),
});

export const AdminResetPasswordApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type AdminResetPasswordHttpRequest = z.infer<typeof AdminResetPasswordApiRequestSchema>;
export type AdminResetPasswordHttpResponse = z.infer<typeof AdminResetPasswordApiResponseSchema>;