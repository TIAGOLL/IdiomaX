import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const RemoveUserRoleFormSchema = z.object({
    user_id: z.string().uuid('ID do usuário inválido'),
    company_id: z.string().uuid('ID da empresa inválido'),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
        message: 'Selecione um papel válido'
    }),
});

// ===== API SCHEMAS (Backend Validation) =====
export const RemoveUserRoleApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
});

export const RemoveUserRoleApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type RemoveUserRoleHttpRequest = z.infer<typeof RemoveUserRoleApiRequestSchema>;
export type RemoveUserRoleHttpResponse = z.infer<typeof RemoveUserRoleApiResponseSchema>;