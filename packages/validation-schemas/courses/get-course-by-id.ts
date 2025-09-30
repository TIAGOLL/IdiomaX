import { z } from 'zod'

export const GetCourseByIdApiRequestSchema = z.object({
    course_id: z.string().uuid('ID do curso inválido'),
    company_id: z.string().uuid('ID da empresa inválido')
})

export const GetCourseByIdApiResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    registration_value: z.number(),
    workload: z.number(),
    monthly_fee_value: z.number(),
    minimum_grade: z.number(),
    maximum_grade: z.number(),
    minimum_frequency: z.number(),
    syllabus_url: z.string().nullable(),
    company_id: z.string(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string()
})

export type GetCourseByIdRequestType = z.infer<typeof GetCourseByIdApiRequestSchema>
export type GetCourseByIdResponseType = z.infer<typeof GetCourseByIdApiResponseSchema>