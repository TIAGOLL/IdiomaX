import { z } from 'zod'

export const DeleteDisciplineApiResponseSchema = z.object({
    message: z.string()
})

export const DeleteDisciplineApiRequestSchema = z.object({
    id: z.string().uuid('ID da disciplina inválido'),
    company_id: z.string().uuid('ID da empresa inválido')
})

export type DeleteDisciplineRequestType = z.infer<typeof DeleteDisciplineApiRequestSchema>
export type DeleteDisciplineResponseType = z.infer<typeof DeleteDisciplineApiResponseSchema>