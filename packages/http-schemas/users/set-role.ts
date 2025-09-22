import { z } from 'zod'

// Enum para roles
const RoleSchema = z.enum(['STUDENT', 'TEACHER', 'ADMIN'])

// Schema para formulário web (não aplicável para esta ação administrativa)
export const SetRoleFormSchema = z.object({
    userId: z.string().min(1, 'ID do usuário é obrigatório'),
    role: RoleSchema,
})

// API Schema para requisição na API
export const SetRoleApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    role: RoleSchema,
})

// API Schema para resposta da API
export const SetRoleApiResponseSchema = z.object({
    message: z.string(),
})

// HTTP Schema para serviços do frontend
export const SetRoleHttpRequestSchema = z.object({
    userId: z.string(),
    role: RoleSchema,
})

export const SetRoleHttpResponseSchema = z.object({
    message: z.string(),
})

// Types
export type SetRoleFormData = z.infer<typeof SetRoleFormSchema>
export type SetRoleApiRequestData = z.infer<typeof SetRoleApiRequestSchema>
export type SetRoleApiResponseData = z.infer<typeof SetRoleApiResponseSchema>
export type SetRoleHttpRequestData = z.infer<typeof SetRoleHttpRequestSchema>
export type SetRoleHttpResponseData = z.infer<typeof SetRoleHttpResponseSchema>
export type Role = z.infer<typeof RoleSchema>