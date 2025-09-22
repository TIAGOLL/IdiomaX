import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const GetUsersFormSchema = z.object({
    search: z.string()
        .max(256, 'Busca muito longa')
        .optional(),
    active: z.boolean()
        .optional(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
        message: 'Tipo de usuário inválido'
    }).optional(),
    page: z.number()
        .min(1, 'Página deve ser maior que 0')
        .default(1),
    limit: z.number()
        .min(1, 'Limite deve ser maior que 0')
        .max(100, 'Limite máximo de 100 itens')
        .default(10),
});

// ===== API SCHEMAS (Backend Validation) =====
export const GetUsersApiRequestSchema = z.object({
    company_id: z.string().uuid(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(10000).default(10),
    search: z.string().optional(),
    active: z.coerce.boolean().optional(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).optional(),
});

export const GetUsersApiResponseSchema = z.object({
    users: z.array(z.object({
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
    })),
    pagination: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        pages: z.number(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type GetUsersHttpRequest = z.infer<typeof GetUsersApiRequestSchema>;
export type GetUsersHttpResponse = z.infer<typeof GetUsersApiResponseSchema>;

// ===== UTILITY TYPES =====
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserWithRole = GetUsersHttpResponse['users'][0];