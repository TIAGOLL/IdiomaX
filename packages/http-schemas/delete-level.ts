import { z } from 'zod'

export const deleteLevelSchema = {
    response: z.object({
        message: z.string()
    })
}

export type DeleteLevelResponse = z.infer<typeof deleteLevelSchema.response>