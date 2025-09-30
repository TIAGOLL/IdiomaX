import { z } from 'zod'

// ===== API SCHEMAS (Backend Validation) =====
export const GetClassApiRequestSchema = z.object({
    company_id: z.string().uuid(),
})

export const GetClassApiResponseSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        vacancies: z.union([z.number(), z.string()]).transform((v) => Number(v)),
        created_at: z.date(),
        course_id: z.string(),
        updated_at: z.date(),
        created_by: z.string(),
        updated_by: z.string(),
        active: z.boolean(),
        _count: { users_in_class: z.number().min(0) },
        courses: z.object({
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
        }),
    }))

// ===== HTTP TYPES (Frontend Services) =====
export type GetClassRequestType = z.infer<typeof GetClassApiRequestSchema>
export type GetClassResponseType = z.infer<typeof GetClassApiResponseSchema>
