import { z } from 'zod'

export const GetCourseByIdApiParamsSchema = z.object({
    course_id: z.string().uuid('ID do curso inválido')
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
    syllabus: z.string().nullable(),
    companies_id: z.string(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string()
})

export type GetCourseByIdParams = z.infer<typeof GetCourseByIdApiParamsSchema>
export type GetCourseByIdResponse = z.infer<typeof GetCourseByIdApiResponseSchema>