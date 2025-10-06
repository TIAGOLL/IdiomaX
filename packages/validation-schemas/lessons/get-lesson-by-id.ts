import { z } from 'zod'

// ===== API SCHEMAS (Backend Validation) =====
export const GetLessonByIdApiRequestSchema = z.object({
    id: z.string().uuid(),
    company_id: z.string().uuid(),
})

export const GetLessonByIdApiResponseSchema = z.object({
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
        }),
        users_in_class: z.array(z.object({
            user_id: z.string(),
            teacher: z.boolean(),
            users: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
            })
        }))
    }),
    presence_list: z.array(z.object({
        id: z.string(),
        is_present: z.boolean(),
        user_id: z.string(),
        users: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
        })
    }))
})

// ===== HTTP TYPES (Frontend Services) =====
export type GetLessonByIdRequestType = z.infer<typeof GetLessonByIdApiRequestSchema>
export type GetLessonByIdResponseType = z.infer<typeof GetLessonByIdApiResponseSchema>