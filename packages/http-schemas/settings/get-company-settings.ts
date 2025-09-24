import { z } from 'zod'

// ===== API SCHEMAS (Backend Validation) =====
export const GetCompanySettingsApiRequestSchema = z.object({
    company_id: z.string().uuid(),
})

export const GetCompanySettingsApiResponseSchema = z.object({
    registration_time: z.number(),
})

// ===== TYPES =====
export type GetCompanySettingsApiRequestData = z.infer<typeof GetCompanySettingsApiRequestSchema>
export type GetCompanySettingsApiResponseData = z.infer<typeof GetCompanySettingsApiResponseSchema>

// ===== HTTP TYPES (Frontend Services) =====
export type GetCompanySettingsHttpRequest = z.infer<typeof GetCompanySettingsApiRequestSchema>
export type GetCompanySettingsHttpResponse = z.infer<typeof GetCompanySettingsApiResponseSchema>