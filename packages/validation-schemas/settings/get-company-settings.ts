import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
// Schemas com mensagens de erro traduzidas para o usuário
export const GetCompanySettingsFormSchema = z.object({
    companyId: z.string().uuid('ID da empresa inválido'),
})

// ===== API SCHEMAS (Backend Validation) =====
// Schemas para validação rigorosa da API
export const GetCompanySettingsApiRequestSchema = z.object({
    company_id: z.string().uuid(),
})

export const GetCompanySettingsApiResponseSchema = z.object({
    registration_time: z.number(),
})

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type GetCompanySettingsRequestType = z.infer<typeof GetCompanySettingsApiRequestSchema>;
export type GetCompanySettingsResponseType = z.infer<typeof GetCompanySettingsApiResponseSchema>;