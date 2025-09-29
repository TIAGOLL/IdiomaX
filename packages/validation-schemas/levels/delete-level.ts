import { z } from 'zod'

export const DeleteLevelApiRequest = z.object({
  level_id: z.string().uuid(),
  company_id: z.string().uuid()
})

export const DeleteLevelApiResponse = z.object({
  message: z.string()
})

export type DeleteLevelRequest = z.infer<typeof DeleteLevelApiRequest>
export type DeleteLevelResponse = z.infer<typeof DeleteLevelApiResponse>