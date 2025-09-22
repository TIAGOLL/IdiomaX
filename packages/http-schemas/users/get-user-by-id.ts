import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const GetUserByIdFormSchema = z.object({
    userId: z.string()
        .uuid('ID do usuário é obrigatório'),
});

// ===== API SCHEMAS (Backend Validation) =====
export const GetUserByIdApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
});

export const GetUserByIdApiResponseSchema = z.object({
    user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        cpf: z.string(),
        phone: z.string(),
        username: z.string(),
        gender: z.enum(['M', 'F']),
        date_of_birth: z.date(),
        address: z.string(),
        avatar_url: z.string().nullable(),
        active: z.boolean(),
        role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
        created_at: z.date(),
        updated_at: z.date(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type GetUserByIdHttpRequest = z.infer<typeof GetUserByIdApiRequestSchema>;
export type GetUserByIdHttpResponse = z.infer<typeof GetUserByIdApiResponseSchema>;