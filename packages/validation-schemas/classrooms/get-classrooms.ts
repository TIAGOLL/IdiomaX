import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
// Schemas com mensagens de erro traduzidas para o usuário
export const GetClassroomsFormSchema = z.object({
    search: z.string().optional(),
    active: z.boolean().optional(),
})

// ===== API SCHEMAS (Backend Validation) =====
// Schemas para validação rigorosa da API
export const GetClassroomsApiRequestSchema = z.object({
    company_id: z.string().uuid()
})

export const GetClassroomsApiResponseSchema = z.array(z.object({
    id: z.string(),
    number: z.union([z.number(), z.string()]).transform((val) => Number(val)),
    block: z.string(),
    company_id: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    active: z.boolean()
}))

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type GetClassroomsRequestType = z.infer<typeof GetClassroomsApiRequestSchema>;
export type GetClassroomsResponseType = z.infer<typeof GetClassroomsApiResponseSchema>;