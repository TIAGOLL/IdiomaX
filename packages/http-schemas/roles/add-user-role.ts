import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const AddUserRoleFormSchema = z.object({
    userId: z.string().uuid('ID do usuário inválido'),
    companyId: z.string().uuid('ID da empresa inválido'),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
        message: 'Selecione um papel válido'
    }),
});

// ===== API SCHEMAS (Backend Validation) =====
export const AddUserRoleApiRequestSchema = z.object({
    userId: z.string().uuid(),
    companyId: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
});

export const AddUserRoleApiResponseSchema = z.object({
    message: z.string(),
    member: z.object({
        id: z.string().uuid(),
        role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
        company_id: z.string().uuid(),
        user_id: z.string().uuid(),
        created_at: z.date(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type AddUserRoleHttpRequest = z.infer<typeof AddUserRoleApiRequestSchema>;
export type AddUserRoleHttpResponse = z.infer<typeof AddUserRoleApiResponseSchema>;