import { z } from 'zod'

export const DeactivateCourseFormSchema = z.object({
    active: z.boolean()
})

export const DeactivateCourseApiRequest = z.object({
    course_id: z.string().uuid(),
    company_id: z.string().uuid(),
    active: z.boolean()
})

export const DeactivateCourseApiResponse = z.object({
    message: z.string()
})

export type DeactivateCourseRequestType = z.infer<typeof DeactivateCourseApiRequest>
export type DeactivateCourseResponseType = z.infer<typeof DeactivateCourseApiResponse>