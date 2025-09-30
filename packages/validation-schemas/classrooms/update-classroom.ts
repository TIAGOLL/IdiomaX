import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
// Schemas com mensagens de erro traduzidas para o usuário
export const UpdateClassroomFormSchema = z.object({
    number: z.number().min(1, { message: 'Número da sala é obrigatório' }),
    block: z.string().min(1, { message: 'Bloco é obrigatório' })
})

// ===== API SCHEMAS (Backend Validation) =====
// Schemas para validação rigorosa da API
export const UpdateClassroomApiRequestSchema = z.object({
    id: z.string().min(1),
    company_id: z.string().uuid(),
    number: z.number().min(1),
    block: z.string().min(1)
})

export const UpdateClassroomApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type UpdateClassroomRequestType = z.infer<typeof UpdateClassroomApiRequestSchema>;
export type UpdateClassroomResponseType = z.infer<typeof UpdateClassroomApiResponseSchema>;