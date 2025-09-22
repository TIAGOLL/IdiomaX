import { z } from 'zod'

// Form Schema para formulário de redefinição de senha
export const ResetPasswordFormSchema = z.object({
    token: z.string()
        .min(1, { message: 'Token é obrigatório.' }),

    password: z.string()
        .min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' })
        .max(1024, { message: 'Senha deve ter no máximo 1024 caracteres.' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número.'
        }),

    confirmPassword: z.string()
        .min(1, { message: 'Confirmação de senha é obrigatória.' }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword']
})

// API Schema para requisição na API
export const ResetPasswordApiRequest = z.object({
    token: z.string().min(1),
    password: z.string().min(6).max(1024),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

// API Schema para resposta da API
export const ResetPasswordApiResponse = z.object({
    message: z.string(),
})

// Types para serviços do frontend
export type ResetPasswordRequestType = z.infer<typeof ResetPasswordApiRequest>
export type ResetPasswordResponseType = z.infer<typeof ResetPasswordApiResponse>