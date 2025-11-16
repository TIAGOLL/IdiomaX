import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateTaskFormSchema = z.object({
    title: z.string()
        .min(3, 'Título deve ter pelo menos 3 caracteres')
        .max(256, 'Título muito longo'),
    description: z.string()
        .max(1024, 'Descrição muito longa')
        .optional(),
    value: z.coerce.number()
        .min(0, 'Valor deve ser positivo')
        .max(100, 'Valor máximo é 100'),
    submit_date: z.string()
        .min(1, 'Data e horário de entrega são obrigatórios'),
    discipline_id: z.string()
        .uuid('Disciplina inválida')
        .min(1, 'Selecione uma disciplina'),
    file: z.any().optional(),
});

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateTaskApiRequestSchema = z.object({
    title: z.string().min(3).max(256),
    description: z.string().max(1024).optional(),
    value: z.number().min(0).max(100),
    submit_date: z.string(), // ISO DateTime string
    discipline_id: z.string().uuid(),
    file: z.any().optional(),
});

export const UpdateTaskApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateTaskRequestType = z.infer<typeof UpdateTaskApiRequestSchema>;
export type UpdateTaskResponseType = z.infer<typeof UpdateTaskApiResponseSchema>;
