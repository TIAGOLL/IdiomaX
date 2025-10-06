import { z } from 'zod'

// ===== API SCHEMAS (Backend Validation) =====
export const GetLessonsApiRequestSchema = z.object({
    company_id: z.string().uuid(),
    class_id: z.string().uuid().optional(),
})

export const GetLessonsApiResponseSchema = z.array(
    z.object({
        id: z.string(),
        theme: z.string(),
        start_date: z.date(),
        end_date: z.date(),
        class_id: z.string(),
        created_at: z.date(),
        updated_at: z.date(),
        active: z.boolean(),
        class: z.object({
            id: z.string(),
            name: z.string(),
            vacancies: z.number(),
            courses: z.object({
                name: z.string(),
            })
        }),
        _count: z.object({
            presence_list: z.number().min(0)
        }),
    })
)

// ===== HTTP TYPES (Frontend Services) =====
export type GetLessonsRequestType = z.infer<typeof GetLessonsApiRequestSchema>
export type GetLessonsResponseType = z.infer<typeof GetLessonsApiResponseSchema>