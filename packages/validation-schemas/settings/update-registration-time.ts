import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateRegistrationTimeFormSchema = z.object({
    registration_time: z.number({ error: 'Tempo de matrícula deve ser um número' })
        .min(1, 'Tempo de matrícula deve ser pelo menos 1 mês')
        .max(60, 'Tempo de matrícula deve ser no máximo 60 meses')
        .int('Tempo de matrícula deve ser um número inteiro'),
})

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateRegistrationTimeApiRequestSchema = z.object({
    company_id: z.string().uuid(),
    registration_time: z.number().min(1).max(60).int(),
})

export const UpdateRegistrationTimeApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type UpdateRegistrationTimeRequestType = z.infer<typeof UpdateRegistrationTimeApiRequestSchema>;
export type UpdateRegistrationTimeResponseType = z.infer<typeof UpdateRegistrationTimeApiResponseSchema>;