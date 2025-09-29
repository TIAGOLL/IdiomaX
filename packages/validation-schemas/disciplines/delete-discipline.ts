import { z } from 'zod'

export const DeleteDisciplineApiResponseSchema = z.object({
    message: z.string()
})

export type DeleteDisciplineResponse = z.infer<typeof DeleteDisciplineApiResponseSchema>