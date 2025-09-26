import { z } from 'zod'

export const DeactivateCourseFormSchema = z.object({
    active: z.boolean()
})

export const DeactivateCourseApiRequest = z.object({
    course_id: z.string().uuid(),
    companies_id: z.string().uuid(),
    active: z.boolean()
})

export const DeactivateCourseApiResponse = z.object({
    message: z.string()
})

export type DeactivateCourseFormData = z.infer<typeof DeactivateCourseFormSchema>
export type DeactivateCourseRequest = z.infer<typeof DeactivateCourseApiRequest>
export type DeactivateCourseResponse = z.infer<typeof DeactivateCourseApiResponse>