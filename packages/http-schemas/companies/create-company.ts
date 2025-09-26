import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateCompanyFormSchema = z.object({
    name: z.string()
        .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
        .max(256, 'Nome da empresa muito longo'),
    cnpj: z.string()
        .length(14, 'CNPJ deve ter exatamente 14 dígitos')
        .regex(/^\d{14}$/, 'CNPJ deve conter apenas números'),
    phone: z.string()
        .min(10, 'Telefone muito curto')
        .max(15, 'Telefone muito longo')
        .regex(/^\d+$/, 'Telefone deve conter apenas números'),
    email: z.string()
        .email('Email deve ser válido')
        .max(256, 'Email muito longo')
        .optional(),
    address: z.string()
        .max(512, 'Endereço muito longo')
        .optional(),
    socialReason: z.string()
        .min(2, 'Razão social deve ter pelo menos 2 caracteres')
        .max(256, 'Razão social muito longa')
        .optional(),
    stateRegistration: z.string()
        .max(50, 'Inscrição estadual muito longa')
        .optional(),
    taxRegime: z.string()
        .max(50, 'Regime tributário muito longo')
        .optional(),
});

// ===== API SCHEMAS (Backend Validation) =====
export const CreateCompanyApiRequestSchema = z.object({
    name: z.string().min(2).max(256),
    cnpj: z.string().length(14),
    phone: z.string().min(10).max(15),
    email: z.string().email().max(256).optional(),
    address: z.string().max(512),
    logo_16x16_url: z.string().url().max(1024).optional(),
    logo_512x512_url: z.string().url().max(1024).optional(),
    social_reason: z.string().min(2).max(256).optional(),
    state_registration: z.string().max(50).optional(),
    tax_regime: z.string().max(50).optional(),
});

export const CreateCompanyApiResponseSchema = z.object({
    message: z.string(),
    companyId: z.string().uuid(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type CreateCompanyHttpRequest = z.infer<typeof CreateCompanyApiRequestSchema>;
export type CreateCompanyHttpResponse = z.infer<typeof CreateCompanyApiResponseSchema>;