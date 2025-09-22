import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const GetCompanyByIdFormSchema = z.object({
    companyId: z.string()
        .uuid('ID da empresa é obrigatório'),
});

// ===== API SCHEMAS (Backend Validation) =====
export const GetCompanyByIdApiRequestSchema = z.object({
    company_id: z.string().uuid(),
});

export const GetCompanyByIdApiResponseSchema = z.object({
    company: z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string().nullable(),
        website: z.string().nullable(),
        phone: z.string().nullable(),
        address: z.string().nullable(),
        logo_url: z.string().nullable(),
        owner_id: z.string().uuid(),
        active: z.boolean(),
        created_at: z.date(),
        updated_at: z.date(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type GetCompanyByIdHttpRequest = z.infer<typeof GetCompanyByIdApiRequestSchema>;
export type GetCompanyByIdHttpResponse = z.infer<typeof GetCompanyByIdApiResponseSchema>;