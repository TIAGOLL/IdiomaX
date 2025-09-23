import { z } from 'zod'

export const DeactivateLevelSchema = {
    body: z.object({
        active: z.boolean()
    }),
    response: z.object({
        message: z.string()
    })
}

export type DeactivateLevelBody = z.infer<typeof DeactivateLevelSchema.body>
export type DeactivateLevelResponse = z.infer<typeof DeactivateLevelSchema.response>