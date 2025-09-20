import { z } from "zod";

// Schema de aulas (classes no Prisma)
export const ClassSessionsSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da aula deve ser um UUID válido.' }),

    theme: z.string()
        .min(2, { message: 'Tema da aula deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Tema da aula deve ter no máximo 256 caracteres.' }),

    start_date: z.coerce.date({ message: 'Data de início deve ser uma data válida.' }),

    end_date: z.coerce.date({ message: 'Data de fim deve ser uma data válida.' }),

    class_id: z.string()
        .uuid({ message: 'ID da turma deve ser um UUID válido.' }),
}).refine((data) => data.start_date < data.end_date, {
    message: 'Data de início deve ser anterior à data de fim.',
    path: ['start_date'],
});

// Schema para criação de aula
export const CreateClassSessionSchema = ClassSessionsSchema.omit({
    id: true,
});

// Schema para atualização de aula
export const UpdateClassSessionSchema = ClassSessionsSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da aula deve ser um UUID válido.' }),
    });

// Tipos TypeScript
export type ClassSession = z.infer<typeof ClassSessionsSchema>;
export type CreateClassSession = z.infer<typeof CreateClassSessionSchema>;
export type UpdateClassSession = z.infer<typeof UpdateClassSessionSchema>;