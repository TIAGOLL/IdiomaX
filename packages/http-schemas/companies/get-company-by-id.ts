import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const GetCompanyByIdFormSchema = z.object({
    company_id: z.string()
        .uuid('ID da empresa é obrigatório'),
});

// ===== API SCHEMAS (Backend Validation) =====
export const GetCompanyByIdApiRequestSchema = z.object({
    company_id: z.string().uuid(),
});

export const GetCompanyByIdApiResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(256),
    phone: z.string().min(10).max(15).regex(/^\d+$/).nullable().optional(),
    address: z.string().max(512).nullable().optional(),
    email: z.string().email().max(256).nullable().optional(),
    logo_16x16_url: z.string().url().max(512).nullable().optional(),
    logo_512x512_url: z.string().url().max(512).nullable().optional(),
    social_reason: z.string().max(256).nullable().optional(),
    state_registration: z.string().max(256).nullable().optional(),
    tax_regime: z.string().max(256).nullable().optional(),
    cnpj: z.string().min(14).max(14).nullable().optional(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type GetCompanyByIdHttpRequest = z.infer<typeof GetCompanyByIdApiRequestSchema>;
export type GetCompanyByIdHttpResponse = z.infer<typeof GetCompanyByIdApiResponseSchema>;