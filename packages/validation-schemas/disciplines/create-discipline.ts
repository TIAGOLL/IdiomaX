import { z } from 'zod'

export const CreateDisciplineFormSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    level_id: z.string().uuid('ID do nível inválido')
})

export const CreateDisciplineApiRequestSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    level_id: z.string().uuid('ID do nível inválido'),
    company_id: z.string().uuid('ID da empresa inválido')
})

export const CreateDisciplineApiResponseSchema = z.object({
    message: z.string()
})

export type CreateDisciplineRequestType = z.infer<typeof CreateDisciplineApiRequestSchema>
export type CreateDisciplineResponseType = z.infer<typeof CreateDisciplineApiResponseSchema>