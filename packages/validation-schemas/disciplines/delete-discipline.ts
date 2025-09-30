import { z } from 'zod'

export const DeleteDisciplineApiResponseSchema = z.object({
    message: z.string()
})

export const DeleteDisciplineApiRequestSchema = z.object({
    id: z.string().uuid('ID da disciplina inválido'),
})

export type DeleteDisciplineRequestType = z.infer<typeof DeleteDisciplineApiRequestSchema>
export type DeleteDisciplineResponseType = z.infer<typeof DeleteDisciplineApiResponseSchema>