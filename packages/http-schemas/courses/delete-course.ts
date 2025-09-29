import { z } from 'zod'

export const DeleteCourseApiRequest = z.object({
    course_id: z.string().uuid(),
    company_id: z.string().uuid()
})

export const DeleteCourseApiResponse = z.object({
    message: z.string()
})

export type DeleteCourseRequest = z.infer<typeof DeleteCourseApiRequest>
export type DeleteCourseResponse = z.infer<typeof DeleteCourseApiResponse>