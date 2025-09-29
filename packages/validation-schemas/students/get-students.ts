import { z } from 'zod'

// Schema para paginação
const PaginationSchema = z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive().max(100),
    totalPages: z.number().int().min(0),
    totalItems: z.number().int().min(0),
})

// Schema para filtros
export const GetStudentsFiltersFormSchema = z.object({
    name: z.string()
        .min(1, { message: 'Nome deve ter pelo menos 1 caractere.' })
        .optional(),

    username: z.string()
        .min(1, { message: 'Nome de usuário deve ter pelo menos 1 caractere.' })
        .optional(),

    email: z.string()
        .email({ message: 'E-mail deve ter um formato válido.' })
        .optional(),

    page: z.number()
        .int({ message: 'Página deve ser um número inteiro.' })
        .positive({ message: 'Página deve ser um número positivo.' })
        .default(1),

    pageSize: z.number()
        .int({ message: 'Tamanho da página deve ser um número inteiro.' })
        .positive({ message: 'Tamanho da página deve ser um número positivo.' })
        .max(100, { message: 'Tamanho máximo da página é 100.' })
        .default(10),
})

// API Schema para requisição na API
export const ApiGetStudentsRequest = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
    page: z.number().int().positive().default(1),
    page_size: z.number().int().positive().max(100).default(10),
    company_id: z.string().uuid(),
})

// API Schema para resposta da API
export const ApiGetStudentsResponse = z.object({
    students: z.array(z.object({
        id: z.string().uuid(),
        name: z.string(),
        username: z.string(),
        email: z.string(),
        cpf: z.string().nullable(),
        phone: z.string().nullable(),
        role: z.literal('STUDENT'),
        created_at: z.date(),
        updated_at: z.date(),
    })),
    pagination: PaginationSchema,
})

// Types
export type GetStudentsFiltersFormData = z.infer<typeof GetStudentsFiltersFormSchema>
export type ApiGetStudentsRequestData = z.infer<typeof ApiGetStudentsRequest>
export type ApiGetStudentsResponseData = z.infer<typeof ApiGetStudentsResponse>
// HTTP Types para serviços do frontend (usando z.infer dos schemas da API)
export type HttpGetStudentsRequestData = z.infer<typeof ApiGetStudentsRequest>
export type HttpGetStudentsResponseData = z.infer<typeof ApiGetStudentsResponse>