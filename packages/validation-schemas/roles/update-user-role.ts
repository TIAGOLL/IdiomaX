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
// Types inferidos dos schemas da API para services HTTP
export type UpdateUserRoleRequestType = z.infer<typeof UpdateUserRoleApiRequestSchema>;
export type UpdateUserRoleResponseType = z.infer<typeof UpdateUserRoleApiResponseSchema>;