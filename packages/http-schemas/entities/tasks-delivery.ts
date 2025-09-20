import { z } from "zod";

// Schema de entrega de tarefas
export const TasksDeliverySchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da entrega deve ser um UUID válido.' }),

    tasks_id: z.string()
        .uuid({ message: 'ID da tarefa deve ser um UUID válido.' }),

    registrations_id: z.string()
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    date: z.coerce.date({ message: 'Data de entrega deve ser uma data válida.' })
        .default(() => new Date()),

    file: z.string()
        .base64({ message: 'Arquivo deve ser válido em formato base64.' })
        .nullable()
        .optional(),

    link: z.string()
        .url({ message: 'Link deve ser uma URL válida.' })
        .max(512, { message: 'Link deve ter no máximo 512 caracteres.' })
        .nullable()
        .optional(),
}).refine((data) => data.file || data.link, {
    message: 'Deve fornecer um arquivo ou um link para a entrega.',
    path: ['file'],
});

// Schema para criação de entrega
export const CreateTaskDeliverySchema = TasksDeliverySchema.omit({
    id: true,
    date: true,
});

// Schema para atualização de entrega
export const UpdateTaskDeliverySchema = TasksDeliverySchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da entrega deve ser um UUID válido.' }),
    })
    .omit({
        date: true,
    });

// Schema para entrega de arquivo
export const SubmitTaskFileSchema = z.object({
    tasks_id: z.string()
        .uuid({ message: 'ID da tarefa deve ser um UUID válido.' }),

    registrations_id: z.string()
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    file: z.any()
        .refine((file) => file instanceof File, { message: 'Deve ser um arquivo válido.' })
        .refine((file) => file.size <= 100 * 1024 * 1024, { message: 'Arquivo deve ter no máximo 100MB.' }),
});

// Schema para entrega de link
export const SubmitTaskLinkSchema = z.object({
    tasks_id: z.string()
        .uuid({ message: 'ID da tarefa deve ser um UUID válido.' }),

    registrations_id: z.string()
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    link: z.string()
        .url({ message: 'Link deve ser uma URL válida.' })
        .max(512, { message: 'Link deve ter no máximo 512 caracteres.' }),
});

// Tipos TypeScript
export type TaskDelivery = z.infer<typeof TasksDeliverySchema>;
export type CreateTaskDelivery = z.infer<typeof CreateTaskDeliverySchema>;
export type UpdateTaskDelivery = z.infer<typeof UpdateTaskDeliverySchema>;
export type SubmitTaskFile = z.infer<typeof SubmitTaskFileSchema>;
export type SubmitTaskLink = z.infer<typeof SubmitTaskLinkSchema>;