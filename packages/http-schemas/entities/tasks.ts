import { z } from "zod";

// Schema de tarefas
export const TasksSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da tarefa deve ser um UUID válido.' }),

    title: z.string()
        .min(2, { message: 'Título da tarefa deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Título da tarefa deve ter no máximo 256 caracteres.' }),

    description: z.string()
        .min(1, { message: 'Descrição deve ter pelo menos 1 caractere.' })
        .max(1024, { message: 'Descrição deve ter no máximo 1024 caracteres.' })
        .nullable()
        .optional(),

    file: z.string()
        .base64({ message: 'Arquivo deve ser válido em formato base64.' })
        .nullable()
        .optional(),

    score: z.number()
        .min(0, { message: 'Pontuação deve ser maior ou igual a zero.' })
        .max(100, { message: 'Pontuação deve ser no máximo 100.' })
        .nullable()
        .optional(),

    due_date: z.coerce.date({ message: 'Data de entrega deve ser uma data válida.' })
        .nullable()
        .optional(),

    disciplines_id: z.string()
        .uuid({ message: 'ID da disciplina deve ser um UUID válido.' }),

    created_at: z.coerce.date()
        .default(() => new Date()),
});

// Schema para criação de tarefa
export const CreateTaskSchema = TasksSchema.omit({
    id: true,
    created_at: true,
});

// Schema para atualização de tarefa
export const UpdateTaskSchema = TasksSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da tarefa deve ser um UUID válido.' }),
    })
    .omit({
        created_at: true,
    });

// Schema para upload de arquivo da tarefa
export const UploadTaskFileSchema = z.object({
    file: z.any()
        .refine((file) => file instanceof File, { message: 'Deve ser um arquivo válido.' })
        .refine((file) => file.size <= 50 * 1024 * 1024, { message: 'Arquivo deve ter no máximo 50MB.' }),

    task_id: z.string()
        .uuid({ message: 'ID da tarefa deve ser um UUID válido.' }),
});

// Tipos TypeScript
export type Task = z.infer<typeof TasksSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type UploadTaskFile = z.infer<typeof UploadTaskFileSchema>;