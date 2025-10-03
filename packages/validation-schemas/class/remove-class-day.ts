import { z } from 'zod';

// ===== API SCHEMAS (Backend Validation) =====
export const RemoveClassDayApiRequestSchema = z.object({
    class_day_id: z.string()
        .uuid('ID do dia da turma deve ser um UUID válido')
        .min(1, 'ID do dia da turma é obrigatório'),
    company_id: z.string()
        .uuid('ID da empresa deve ser um UUID válido')
        .min(1, 'ID da empresa é obrigatório')
}).strict(); // strict() impede propriedades extras

export const RemoveClassDayApiResponseSchema = z.object({
    message: z.string().min(1, 'Mensagem de resposta é obrigatória'),
}).strict();

// ===== HTTP TYPES (Frontend Services) =====
export type RemoveClassDayRequestType = z.infer<typeof RemoveClassDayApiRequestSchema>;
export type RemoveClassDayResponseType = z.infer<typeof RemoveClassDayApiResponseSchema>;