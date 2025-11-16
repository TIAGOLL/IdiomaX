import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateTaskFormSchema = z.object({
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
    file: z.any().optional(), // File upload
});

// ===== API SCHEMAS (Backend Validation) =====
export const CreateTaskApiRequestSchema = z.object({
    title: z.string().min(3).max(256),
    description: z.string().max(1024).optional(),
    value: z.number().min(0).max(100),
    submit_date: z.string(), // ISO DateTime string
    discipline_id: z.string().uuid(),
    file: z.any().optional(), // Bytes ou base64
});

export const CreateTaskApiResponseSchema = z.object({
    message: z.string(),
    taskId: z.string().uuid(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type CreateTaskRequestType = z.infer<typeof CreateTaskApiRequestSchema>;
export type CreateTaskResponseType = z.infer<typeof CreateTaskApiResponseSchema>;
