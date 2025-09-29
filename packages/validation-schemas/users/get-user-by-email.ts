import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const GetUserByEmailFormSchema = z.object({
    email: z.string()
        .email('Email inválido')
        .max(256, 'Email muito longo'),
});

// ===== API SCHEMAS (Backend Validation) =====
export const GetUserByEmailApiRequestSchema = z.object({
    email: z.string().email().max(256),
    company_id: z.string().uuid(),
});

export const GetUserByEmailApiResponseSchema = z.object({
    user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        username: z.string(),
        role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
        active: z.boolean(),
    }).nullable(),
});

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type GetUserByEmailRequestType = z.infer<typeof GetUserByEmailApiRequestSchema>;
export type GetUserByEmailResponseType = z.infer<typeof GetUserByEmailApiResponseSchema>;