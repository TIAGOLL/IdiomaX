import { z } from 'zod'

// Form Schema para formulário de solicitação de recuperação de senha
export const RequestPasswordRecoverFormSchema = z.object({
    email: z.string()
        .email({ message: 'E-mail deve ter um formato válido.' })
        .max(256, { message: 'E-mail deve ter no máximo 256 caracteres.' }),
})

// API Schema para requisição na API
export const RequestPasswordRecoverApiRequest = z.object({
    email: z.string().email().max(256),
})

// API Schema para resposta da API
export const RequestPasswordRecoverApiResponse = z.object({
    message: z.string(),
})

// Types para serviços do frontend
export type RequestPasswordRecoverRequestType = z.infer<typeof RequestPasswordRecoverApiRequest>
export type RequestPasswordRecoverResponseType = z.infer<typeof RequestPasswordRecoverApiResponse>