import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateCompanyFormSchema = z.object({
    name: z.string()
        .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
        .max(256, 'Nome da empresa muito longo'),
    cnpj: z.string().min(14, { message: 'CNPJ deve ter 14 caracteres.' }).max(14),
    email: z.email({ message: 'E-mail inválido.' }).max(256).optional().nullable(),
    logo_16x16_url: z.url({ message: 'URL inválida.' }).max(512).optional().nullable(),
    logo_512x512_url: z.url({ message: 'URL inválida.' }).max(512).optional().nullable(),
    social_reason: z.string({ message: 'Razão social inválida.' }).max(256).optional().nullable(),
    state_registration: z.string({ message: 'Inscrição estadual inválida.' }).max(256).optional().nullable(),
    tax_regime: z.string({ message: 'Regime tributário inválido.' }).max(256).optional().nullable(),
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

export const UpdateCompanyApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateCompanyHttpRequest = z.infer<typeof UpdateCompanyApiRequestSchema>;
export type UpdateCompanyHttpResponse = z.infer<typeof UpdateCompanyApiResponseSchema>;