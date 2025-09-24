import { z } from 'zod'

export const CreateClassroomFormSchema = z.object({
    number: z.number().min(1, { message: 'Número da sala é obrigatório' }),
    block: z.string().optional()
})

export const CreateClassroomResponseSchema = z.object({
    message: z.string(),
})

export const CreateClassroomApiResponseSchema = z.object({
    message: z.string(),
})
export const CreateClassroomApiRequestSchema = z.object({
    number: z.string().min(1).or(z.number().min(1)),
    block: z.string().optional(),
    companies_id: z.string().uuid()
})