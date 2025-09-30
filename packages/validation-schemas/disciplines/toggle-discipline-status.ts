import { z } from 'zod'

export const AlterDisciplineStatusFormSchema = z.object({
    id: z.string().uuid('ID da disciplina inválido'),
    active: z.boolean()
})

export const AlterDisciplineStatusApiRequestSchema = z.object({
    id: z.string().uuid('ID da disciplina inválido'),
    active: z.boolean(),
    company_id: z.string().uuid('ID da empresa inválido'),
})

export const AlterDisciplineStatusApiResponseSchema = z.object({
    message: z.string()
})

export type AlterDisciplineStatusRequestType = z.infer<typeof AlterDisciplineStatusApiRequestSchema>
export type AlterDisciplineStatusResponseType = z.infer<typeof AlterDisciplineStatusApiResponseSchema>