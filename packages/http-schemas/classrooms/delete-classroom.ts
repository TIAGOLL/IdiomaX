import { z } from 'zod'

export const DeleteClassroomApiRequestSchema = z.object({
    id: z.string().min(1, { message: 'ID da sala é obrigatório' }),
    companies_id: z.string().uuid()
})

export const DeleteClassroomApiResponseSchema = z.object({
    message: z.string()
})

export type DeleteClassroomApiRequest = z.infer<typeof DeleteClassroomApiRequestSchema>
export type DeleteClassroomApiResponse = z.infer<typeof DeleteClassroomApiResponseSchema>