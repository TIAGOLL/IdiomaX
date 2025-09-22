import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const DeleteUserFormSchema = z.object({
    userId: z.string()
        .uuid('ID do usuário é obrigatório'),
    confirmDelete: z.boolean()
        .refine(val => val === true, {
            message: 'Você deve confirmar a exclusão'
        }),
});

// ===== API SCHEMAS (Backend Validation) =====
export const DeleteUserApiRequestSchema = z.object({
    userId: z.string().uuid(),
    companyId: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
});

export const DeleteUserApiResponseSchema = z.object({
    message: z.string(),
    deleted_user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type DeleteUserHttpRequest = z.infer<typeof DeleteUserApiRequestSchema>;
export type DeleteUserHttpResponse = z.infer<typeof DeleteUserApiResponseSchema>;