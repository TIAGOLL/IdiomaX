import { z } from 'zod'

// API Schema para parâmetros na API
export const GetCoursesApiParamsSchema = z.object({
    company_id: z.string().uuid(),
})

// API Schema para resposta da API
export const GetCoursesApiResponseSchema = z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    company_id: z.string().uuid(),
    created_at: z.date(),
    updated_at: z.date(),
    active: z.boolean(),
}))

// HTTP Schema para serviços do frontend
export const GetCoursesHttpParamsSchema = z.object({
    company_id: z.string(),
})

export const GetCoursesHttpResponseSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    company_id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    active: z.boolean(),
}))

// Types
export type GetCoursesApiParamsData = z.infer<typeof GetCoursesApiParamsSchema>
export type GetCoursesApiResponseData = z.infer<typeof GetCoursesApiResponseSchema>
export type GetCoursesHttpParamsData = z.infer<typeof GetCoursesHttpParamsSchema>
export type GetCoursesHttpResponseData = z.infer<typeof GetCoursesHttpResponseSchema>