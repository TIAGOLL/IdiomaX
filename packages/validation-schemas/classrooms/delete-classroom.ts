import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
// Schemas com mensagens de erro traduzidas para o usuário
export const DeleteClassroomFormSchema = z.object({
    id: z.string().min(1, { message: 'ID da sala é obrigatório' }),
})

// ===== API SCHEMAS (Backend Validation) =====
// Schemas para validação rigorosa da API
export const DeleteClassroomApiRequestSchema = z.object({
    id: z.string().min(1),
    company_id: z.string().uuid()
})

export const DeleteClassroomApiResponseSchema = z.object({
    message: z.string()
})

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type DeleteClassroomRequestType = z.infer<typeof DeleteClassroomApiRequestSchema>;
export type DeleteClassroomResponseType = z.infer<typeof DeleteClassroomApiResponseSchema>;