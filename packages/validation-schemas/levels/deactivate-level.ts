import { z } from 'zod'

export const DeactivateLevelFormSchema = z.object({
  active: z.boolean()
})

export const DeactivateLevelApiRequest = z.object({
  level_id: z.string().uuid(),
  company_id: z.string().uuid(),
  active: z.boolean()
})

export const DeactivateLevelApiResponse = z.object({
  message: z.string()
})

export type DeactivateLevelFormData = z.infer<typeof DeactivateLevelFormSchema>
export type DeactivateLevelRequestType = z.infer<typeof DeactivateLevelApiRequest>
export type DeactivateLevelResponseType = z.infer<typeof DeactivateLevelApiResponse>