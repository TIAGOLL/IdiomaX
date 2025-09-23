import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateUserRoleFormSchema = z.object({
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
        message: 'Selecione um papel válido'
    }),
});

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateUserRoleApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
});

export const UpdateUserRoleApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateUserRoleHttpRequest = z.infer<typeof UpdateUserRoleApiRequestSchema>;
export type UpdateUserRoleHttpResponse = z.infer<typeof UpdateUserRoleApiResponseSchema>;