import { z } from 'zod';
import { GenderEnum } from '../enums';

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
    id: z.string().uuid(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
    created_at: z.date(),
    created_by: z.string(),
    updated_at: z.date(),
    updated_by: z.string(),
    active: z.boolean(),
    username: z.string(),
    password: z.string(),
    cpf: z.string(),
    gender: GenderEnum,
    date_of_birth: z.date(),
    avatar_url: z.string().nullable(),
}).nullable();

// ===== HTTP TYPES (Frontend Services) =====
export type GetUserByEmailHttpRequest = z.infer<typeof GetUserByEmailApiRequestSchema>;
export type GetUserByEmailHttpResponse = z.infer<typeof GetUserByEmailApiResponseSchema>;