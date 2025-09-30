import { z } from 'zod';
import { RoleEnum } from '../enums';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const GetUsersFormSchema = z.object({
    search: z.string()
        .max(256, 'Busca muito longa')
        .optional(),
    active: z.boolean()
        .optional(),
    role: RoleEnum.optional(),
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
    role: RoleEnum.optional(),
    search: z.string().max(256).optional(),
    active: z.coerce.boolean().optional().nullable(),
});

export const GetUsersApiResponseSchema = z.array(z.object({
    id: z.string().uuid(),
    name: z.string().min(3).max(256),
    email: z.email().min(3).max(256),
    username: z.string().min(3).max(256),
    password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }).optional(),
    cpf: z.string().min(11).max(11),
    phone: z.string().min(10).max(17),
    gender: z.enum(['M', 'F']),
    date_of_birth: z.date(),
    address: z.string().min(1).max(255),
    avatar_url: z.string().nullable().optional(),
    active: z.boolean(),
    created_by: z.string().uuid().nullable().optional(),
    updated_by: z.string().uuid().nullable().optional(),
    updated_at: z.date().nullable().optional(),
    created_at: z.date(),
    member_on: z.array(
        z.object({
            id: z.uuid(),
            role: RoleEnum,
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
    )
}))

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type GetUsersRequestType = z.infer<typeof GetUsersApiRequestSchema>;
export type GetUsersResponseType = z.infer<typeof GetUsersApiResponseSchema>;