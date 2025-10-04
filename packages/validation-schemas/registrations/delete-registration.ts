import { z } from 'zod';

// ===== API SCHEMAS (Backend Validation) =====
export const DeleteRegistrationApiRequestSchema = z.object({
    id: z.string()
        .uuid('ID da inscrição deve ser um UUID válido')
        .min(1, 'ID da inscrição é obrigatório'),
    company_id: z.string()
        .uuid('ID da empresa deve ser um UUID válido')
        .min(1, 'ID da empresa é obrigatório')
}).strict(); // strict() impede propriedades extras

export const DeleteRegistrationApiResponseSchema = z.object({
    message: z.string().min(1, 'Mensagem de resposta é obrigatória'),
    success: z.boolean().optional(), // Campo opcional para indicar sucesso
}).strict();

// ===== VALIDATION HELPERS =====
export const validateRegistrationDeletion = (data: unknown) => {
    try {
        return {
            success: true,
            data: DeleteRegistrationApiRequestSchema.parse(data)
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof z.ZodError ? error.issues : 'Erro de validação desconhecido'
        };
    }
};

// ===== HTTP TYPES (Frontend Services) =====
export type DeleteRegistrationRequestType = z.infer<typeof DeleteRegistrationApiRequestSchema>;
export type DeleteRegistrationResponseType = z.infer<typeof DeleteRegistrationApiResponseSchema>;