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
    member_on: z.array(
        z.object({
            id: z.uuid(),
            role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
            company_id: z.uuid(),
            user_id: z.uuid(),
            company: z.object({
                id: z.uuid(),
                email: z.email().optional().nullable(),
                name: z.string(),
                created_at: z.date().nullable(),
                phone: z.string(),
                address: z.string(),
                updated_at: z.date().nullable(),
                cnpj: z.string(),
                logo_16x16_url: z.string().nullable().optional(),
                logo_512x512_url: z.string().nullable().optional(),
                social_reason: z.string().nullable(),
                state_registration: z.string().nullable(),
                tax_regime: z.string().nullable(),
                owner_id: z.string(),
            }),
        })
    ),
    created_at: z.date(),
    updated_at: z.date(),
})

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type GetUserByIdRequestType = z.infer<typeof GetUserByIdApiRequestSchema>;
export type GetUserByIdResponseType = z.infer<typeof GetUserByIdApiResponseSchema>;