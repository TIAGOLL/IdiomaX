import { z } from "zod";

// Schema de salas de aula
export const ClassroomsSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da sala deve ser um UUID válido.' }),

    number: z.number()
        .int({ message: 'Número da sala deve ser um número inteiro.' })
        .positive({ message: 'Número da sala deve ser positivo.' })
        .max(99999, { message: 'Número da sala deve ter no máximo 5 dígitos.' }),

    block: z.string()
        .min(1, { message: 'Bloco deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Bloco deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    companies_id: z.string()
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' })
        .nullable()
        .optional(),

    created_at: z.coerce.date()
        .default(() => new Date()),
});

// Schema para criação de sala
export const CreateClassroomSchema = ClassroomsSchema.omit({
    id: true,
    created_at: true,
});

// Schema para atualização de sala
export const UpdateClassroomSchema = ClassroomsSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da sala deve ser um UUID válido.' }),
    })
    .omit({
        created_at: true,
    });

// Tipos TypeScript
export type Classroom = z.infer<typeof ClassroomsSchema>;
export type CreateClassroom = z.infer<typeof CreateClassroomSchema>;
export type UpdateClassroom = z.infer<typeof UpdateClassroomSchema>;