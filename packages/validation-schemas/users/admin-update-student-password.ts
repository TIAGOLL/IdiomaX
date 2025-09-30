import { z } from 'zod'

// Form Schema para formulário de atualização de senha do estudante (admin)
export const AdminUpdateStudentPasswordFormSchema = z.object({
    new_password: z.string()
        .min(6, { message: 'Nova senha deve ter pelo menos 6 caracteres.' })
        .max(1024, { message: 'Nova senha deve ter no máximo 1024 caracteres.' }),

    confirm_password: z.string()
        .min(1, { message: 'Confirmação de senha é obrigatória.' }),
}).refine(data => data.new_password === data.confirm_password, {
    message: 'As senhas não coincidem.',
    path: ['confirm_password']
})

// API Schema para requisição na API
export const ApiAdminUpdateStudentPasswordRequest = z.object({
    company_id: z.string().uuid(),
    user_id: z.string().uuid(),
    new_password: z.string().min(6).max(1024),
})

// API Schema para resposta da API
export const ApiAdminUpdateStudentPasswordResponse = z.object({
    message: z.string(),
})

// Types
export type AdminUpdateStudentPasswordFormData = z.infer<typeof AdminUpdateStudentPasswordFormSchema>
export type AdminUpdateStudentPasswordRequestType = z.infer<typeof ApiAdminUpdateStudentPasswordRequest>
export type AdminUpdateStudentPasswordResponseType = z.infer<typeof ApiAdminUpdateStudentPasswordResponse>