import { z } from 'zod'

// API Schema para resposta da API
export const ApiGetStudentByIdResponse = z.object({
    id: z.string().uuid(),
    name: z.string(),
    username: z.string(),
    email: z.string(),
    cpf: z.string().nullable(),
    phone: z.string().nullable(),
    gender: z.enum(['MASCULINO', 'FEMININO', 'OUTRO']).nullable(),
    date_of_birth: z.date().nullable(),
    address: z.string().nullable(),
    avatar_url: z.string().nullable(),
    role: z.literal('STUDENT'),
    is_active: z.boolean(),
    created_at: z.date(),
    updated_at: z.date(),
    registrations: z.array(z.object({
        id: z.string().uuid(),
        course_id: z.string().uuid(),
        level_id: z.string().uuid(),
        status: z.string(),
        created_at: z.date(),
    })),
})

// Types
export type ApiGetStudentByIdResponseData = z.infer<typeof ApiGetStudentByIdResponse>
// HTTP Types para serviços do frontend (usando z.infer dos schemas da API)
export type HttpGetStudentByIdResponseData = z.infer<typeof ApiGetStudentByIdResponse>