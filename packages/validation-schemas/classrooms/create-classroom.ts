import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
// Schemas com mensagens de erro traduzidas para o usuário
export const CreateClassroomFormSchema = z.object({
    number: z.number().min(1, { message: 'Número da sala é obrigatório' }),
    block: z.string().min(1, { message: 'Bloco é obrigatório' })
})

// ===== API SCHEMAS (Backend Validation) =====
// Schemas para validação rigorosa da API
export const CreateClassroomApiRequestSchema = z.object({
    number: z.string().min(1).or(z.number().min(1)),
    block: z.string().min(1),
    company_id: z.string().uuid()
})

export const CreateClassroomApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type CreateClassroomRequestType = z.infer<typeof CreateClassroomApiRequestSchema>;
export type CreateClassroomResponseType = z.infer<typeof CreateClassroomApiResponseSchema>;