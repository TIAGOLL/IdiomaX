import { z } from 'zod'

export const ToggleDisciplineStatusFormSchema = z.object({
    id: z.string().uuid('ID da disciplina inválido'),
    active: z.boolean()
})

export const ToggleDisciplineStatusApiRequestSchema = z.object({
    active: z.boolean(),
    company_id: z.string().uuid('ID da empresa inválido'),
})

export const ToggleDisciplineStatusApiResponseSchema = z.object({
    message: z.string()
})

export type ToggleDisciplineStatusFormData = z.infer<typeof ToggleDisciplineStatusFormSchema>
export type ToggleDisciplineStatusRequest = z.infer<typeof ToggleDisciplineStatusApiRequestSchema>
export type ToggleDisciplineStatusResponse = z.infer<typeof ToggleDisciplineStatusApiResponseSchema>