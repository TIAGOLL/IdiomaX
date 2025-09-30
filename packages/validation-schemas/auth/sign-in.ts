import { z } from 'zod'

// Form Schema para formulário de login
export const SignInFormSchema = z.object({
    username: z.string()
        .min(3, { message: 'Nome de usuário deve ter pelo menos 3 caracteres.' })
        .max(50, { message: 'Nome de usuário deve ter no máximo 50 caracteres.' })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: 'Nome de usuário deve conter apenas letras, números, hífens e sublinhados.'
        }),

    password: z.string()
        .min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' })
        .max(1024, { message: 'Senha deve ter no máximo 1024 caracteres.' }),
})

// API Schema para requisição na API
export const SignInApiRequest = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(1024),
})

// API Schema para resposta da API
export const SignInApiResponse = z.object({
    message: z.string(),
    token: z.string(),
})

// Types para serviços do frontend
export type SignInRequestType = z.infer<typeof SignInApiRequest>
export type SignInResponseType = z.infer<typeof SignInApiResponse>