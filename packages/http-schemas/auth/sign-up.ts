import { z } from 'zod'
import { GenderApiEnum } from '../enums'

// Form Schema para formulário de registro
export const SignUpFormSchema = z.object({
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
        .max(1024, { message: 'Senha deve ter no máximo 1024 caracteres.' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número.'
        }),

    confirmPassword: z.string()
        .min(1, { message: 'Confirmação de senha é obrigatória.' }),

    cpf: z.string()
        .length(11, { message: 'CPF deve ter exatamente 11 dígitos.' })
        .regex(/^\d{11}$/, { message: 'CPF deve conter apenas números.' }),

    phone: z.string()
        .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' })
        .max(15, { message: 'Telefone deve ter no máximo 15 dígitos.' })
        .regex(/^\d+$/, { message: 'Telefone deve conter apenas números.' }),

    gender: GenderApiEnum,

    date_of_birth: z.string(),

    address: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword']
})

// API Schema para requisição na API
export const SignUpApiRequest = z.object({
    name: z.string().min(2).max(256),
    username: z.string().min(3).max(50),
    email: z.string().email().max(256),
    password: z.string().min(6).max(1024),
    cpf: z.string().length(11),
    phone: z.string().min(10).max(15),
    gender: GenderApiEnum.optional(),
    date_of_birth: z.string().optional(),
    address: z.string().optional(),
})

// API Schema para resposta da API
export const SignUpApiResponse = z.object({
    message: z.string(),
    token: z.string(),
})

// Types para serviços do frontend
export type SignUpRequestType = z.infer<typeof SignUpApiRequest>
export type SignUpResponseType = z.infer<typeof SignUpApiResponse>