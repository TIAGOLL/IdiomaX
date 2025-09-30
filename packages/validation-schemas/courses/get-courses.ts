import { z } from 'zod'

// API Schema para parâmetros na API
export const GetCoursesApiRequestSchema = z.object({
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

// Types
export type GetCoursesRequestType = z.infer<typeof GetCoursesApiRequestSchema>
export type GetCoursesResponseType = z.infer<typeof GetCoursesApiResponseSchema>