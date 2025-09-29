import { z } from 'zod'

export const UpdateDisciplineFormSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres')
})

export const UpdateDisciplineApiRequestSchema = z.object({
    id: z.string().uuid('ID da disciplina inválido'),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    company_id: z.string().uuid('ID da empresa inválido'),
})

export const UpdateDisciplineApiResponseSchema = z.object({
    message: z.string()
})

export type UpdateDisciplineFormData = z.infer<typeof UpdateDisciplineFormSchema>
export type UpdateDisciplineRequest = z.infer<typeof UpdateDisciplineApiRequestSchema>
export type UpdateDisciplineResponse = z.infer<typeof UpdateDisciplineApiResponseSchema>