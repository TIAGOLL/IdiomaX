import { z } from 'zod'

// Form Schema para formulário de atualização de senha do estudante (admin)
export const AdminUpdateStudentPasswordFormSchema = z.object({
    companyId: z.string()
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),

    userId: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    newPassword: z.string()
        .min(6, { message: 'Nova senha deve ter pelo menos 6 caracteres.' })
        .max(1024, { message: 'Nova senha deve ter no máximo 1024 caracteres.' }),

    confirmPassword: z.string()
        .min(1, { message: 'Confirmação de senha é obrigatória.' }),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword']
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
export type ApiAdminUpdateStudentPasswordRequestData = z.infer<typeof ApiAdminUpdateStudentPasswordRequest>
export type ApiAdminUpdateStudentPasswordResponseData = z.infer<typeof ApiAdminUpdateStudentPasswordResponse>
// HTTP Types para serviços do frontend (usando z.infer dos schemas da API)
export type HttpAdminUpdateStudentPasswordRequestData = z.infer<typeof ApiAdminUpdateStudentPasswordRequest>
export type HttpAdminUpdateStudentPasswordResponseData = z.infer<typeof ApiAdminUpdateStudentPasswordResponse>