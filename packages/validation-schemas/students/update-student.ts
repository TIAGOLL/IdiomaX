import { z } from 'zod'

// Form Schema para formulário de atualização de estudante
export const UpdateStudentFormSchema = z.object({
    name: z.string()
        .min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome deve ter no máximo 256 caracteres.' })
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
            message: 'Nome deve conter apenas letras e espaços.'
        })
        .optional(),

    email: z.string()
        .email({ message: 'E-mail deve ter um formato válido.' })
        .max(256, { message: 'E-mail deve ter no máximo 256 caracteres.' })
        .optional(),

    cpf: z.string()
        .length(11, { message: 'CPF deve ter exatamente 11 dígitos.' })
        .regex(/^\d{11}$/, { message: 'CPF deve conter apenas números.' })
        .optional(),

    phone: z.string()
        .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' })
        .max(15, { message: 'Telefone deve ter no máximo 15 dígitos.' })
        .regex(/^\d+$/, { message: 'Telefone deve conter apenas números.' })
        .optional(),

    isActive: z.boolean()
        .optional(),
})

// API Schema para requisição na API
export const ApiUpdateStudentRequest = z.object({
    name: z.string().min(2).max(256).optional(),
    email: z.string().email().max(256).optional(),
    cpf: z.string().length(11).optional(),
    phone: z.string().min(10).max(15).optional(),
    is_active: z.boolean().optional(),
})

// API Schema para resposta da API
export const ApiUpdateStudentResponse = z.object({
    message: z.string(),
    student: z.object({
        id: z.string().uuid(),
        name: z.string(),
        username: z.string(),
        email: z.string(),
        cpf: z.string().nullable(),
        phone: z.string().nullable(),
        is_active: z.boolean(),
        updated_at: z.date(),
    }),
})

// Types
export type UpdateStudentFormData = z.infer<typeof UpdateStudentFormSchema>
export type ApiUpdateStudentRequestData = z.infer<typeof ApiUpdateStudentRequest>
export type ApiUpdateStudentResponseData = z.infer<typeof ApiUpdateStudentResponse>
// HTTP Types para serviços do frontend (usando z.infer dos schemas da API)
export type HttpUpdateStudentRequestData = z.infer<typeof ApiUpdateStudentRequest>
export type HttpUpdateStudentResponseData = z.infer<typeof ApiUpdateStudentResponse>