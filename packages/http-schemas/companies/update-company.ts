import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateCompanyFormSchema = z.object({
    name: z.string()
        .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
        .max(256, 'Nome da empresa muito longo'),
    description: z.string()
        .max(1000, 'Descrição muito longa')
        .optional(),
    website: z.string()
        .url('Website deve ser uma URL válida')
        .max(512, 'Website muito longo')
        .optional(),
    phone: z.string()
        .min(10, 'Telefone muito curto')
        .max(15, 'Telefone muito longo')
        .regex(/^\d+$/, 'Telefone deve conter apenas números')
        .optional(),
    address: z.string()
        .max(512, 'Endereço muito longo')
        .optional(),
});

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateCompanyApiRequestSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(256),
    description: z.string().max(1000).nullable().optional(),
    website: z.string().url().max(512).nullable().optional(),
    phone: z.string().min(10).max(15).regex(/^\d+$/).nullable().optional(),
    address: z.string().max(512).nullable().optional(),
    logo_url: z.string().url().max(1024).nullable().optional(),
});

export const UpdateCompanyApiResponseSchema = z.object({
    message: z.string(),
    company: z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string().nullable(),
        website: z.string().nullable(),
        phone: z.string().nullable(),
        address: z.string().nullable(),
        logo_url: z.string().nullable(),
        updated_at: z.date(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateCompanyHttpRequest = z.infer<typeof UpdateCompanyApiRequestSchema>;
export type UpdateCompanyHttpResponse = z.infer<typeof UpdateCompanyApiResponseSchema>;