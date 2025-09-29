import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateUserRoleFormSchema = z.object({
    userId: z.string()
        .uuid('ID do usuário é obrigatório'),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
        message: 'Selecione um tipo de usuário válido'
    }),
});

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateUserRoleApiRequestSchema = z.object({
    userId: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
    companyId: z.string().uuid(),
});

export const UpdateUserRoleApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type UpdateUserRoleRequestType = z.infer<typeof UpdateUserRoleApiRequestSchema>;
export type UpdateUserRoleResponseType = z.infer<typeof UpdateUserRoleApiResponseSchema>;