import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateRegistrationTimeFormSchema = z.object({
    registrationTime: z.number({ error: 'Tempo de matrícula deve ser um número' })
        .min(1, 'Tempo de matrícula deve ser pelo menos 1 mês')
        .max(60, 'Tempo de matrícula deve ser no máximo 60 meses')
        .int('Tempo de matrícula deve ser um número inteiro'),
})

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateRegistrationTimeApiRequestSchema = z.object({
    company_id: z.string().uuid(),
    registrations_time: z.number().min(1).max(60).int(),
})

export const UpdateRegistrationTimeApiResponseSchema = z.object({
    message: z.string(),
})

// ===== TYPES =====
export type UpdateRegistrationTimeFormData = z.infer<typeof UpdateRegistrationTimeFormSchema>
export type UpdateRegistrationTimeApiRequestData = z.infer<typeof UpdateRegistrationTimeApiRequestSchema>
export type UpdateRegistrationTimeApiResponseData = z.infer<typeof UpdateRegistrationTimeApiResponseSchema>

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateRegistrationTimeHttpRequest = z.infer<typeof UpdateRegistrationTimeApiRequestSchema>
export type UpdateRegistrationTimeHttpResponse = z.infer<typeof UpdateRegistrationTimeApiResponseSchema>