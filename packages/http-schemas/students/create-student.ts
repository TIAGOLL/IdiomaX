import { z } from 'zod'

// Form Schema para formulário de criação de estudante
export const CreateStudentFormSchema = z.object({
    name: z.string()
        .min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome deve ter no máximo 256 caracteres.' })
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
            message: 'Nome deve conter apenas letras e espaços.'
        }),

    username: z.string()
        .min(3, { message: 'Nome de usuário deve ter pelo menos 3 caracteres.' })
        .max(50, { message: 'Nome de usuário deve ter no máximo 50 caracteres.' })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: 'Nome de usuário deve conter apenas letras, números, hífens e sublinhados.'
        }),

    email: z.string()
        .email({ message: 'E-mail deve ter um formato válido.' })
        .max(256, { message: 'E-mail deve ter no máximo 256 caracteres.' }),

    password: z.string()
        .min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' })
        .max(1024, { message: 'Senha deve ter no máximo 1024 caracteres.' }),

    cpf: z.string()
        .length(11, { message: 'CPF deve ter exatamente 11 dígitos.' })
        .regex(/^\d{11}$/, { message: 'CPF deve conter apenas números.' }),

    phone: z.string()
        .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' })
        .max(15, { message: 'Telefone deve ter no máximo 15 dígitos.' })
        .regex(/^\d+$/, { message: 'Telefone deve conter apenas números.' }),

    companyId: z.string()
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
})

// API Schema para requisição na API
export const ApiCreateStudentRequest = z.object({
    name: z.string().min(2).max(256),
    username: z.string().min(3).max(50),
    email: z.string().email().max(256),
    password: z.string().min(6).max(1024),
    cpf: z.string().length(11),
    phone: z.string().min(10).max(15),
    company_id: z.string().uuid(),
})

// API Schema para resposta da API
export const ApiCreateStudentResponse = z.object({
    message: z.string(),
    student: z.object({
        id: z.string().uuid(),
        name: z.string(),
        username: z.string(),
        email: z.string(),
        cpf: z.string(),
        phone: z.string(),
        role: z.literal('STUDENT'),
        created_at: z.date(),
    }),
})

// Types
export type CreateStudentFormData = z.infer<typeof CreateStudentFormSchema>
export type ApiCreateStudentRequestData = z.infer<typeof ApiCreateStudentRequest>
export type ApiCreateStudentResponseData = z.infer<typeof ApiCreateStudentResponse>
// HTTP Types para serviços do frontend (usando z.infer dos schemas da API)
export type HttpCreateStudentRequestData = z.infer<typeof ApiCreateStudentRequest>
export type HttpCreateStudentResponseData = z.infer<typeof ApiCreateStudentResponse>