import { z } from 'zod'
import { PresenceItemSchema, ClassInfoSchema } from './shared-types'

// ===== API SCHEMAS (Backend Validation) =====
export const GetLessonByIdApiRequestSchema = z.object({
    lesson_id: z.string().uuid(),
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
    class: ClassInfoSchema,
    presence_list: z.array(PresenceItemSchema)
})

// ===== HTTP TYPES (Frontend Services) =====
export type GetLessonByIdRequestType = z.infer<typeof GetLessonByIdApiRequestSchema>
export type GetLessonByIdResponseType = z.infer<typeof GetLessonByIdApiResponseSchema>