import { z } from 'zod'

export const UpdateClassroomFormSchema = z.object({
    number: z.number().min(1, { message: 'Número da sala é obrigatório' }),
    block: z.string()
})

export const UpdateClassroomApiRequestSchema = z.object({
    id: z.string().min(1, { message: 'ID da sala é obrigatório' }),
    companies_id: z.string().uuid(),
    number: z.number().min(1, { message: 'Número da sala é obrigatório' }),
    block: z.string()
})

export const UpdateClassroomApiResponseSchema = z.object({
    message: z.string(),
})

export type UpdateClassroomRequest = z.infer<typeof UpdateClassroomApiRequestSchema>
export type UpdateClassroomResponse = z.infer<typeof UpdateClassroomApiResponseSchema>