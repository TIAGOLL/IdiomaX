import { z } from "zod";

// Schema de turmas (Renamedclass no Prisma)
export const ClassesSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da turma deve ser um UUID válido.' }),

    nome: z.string()
        .min(2, { message: 'Nome da turma deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome da turma deve ter no máximo 256 caracteres.' }),

    vacancies: z.number()
        .int({ message: 'Número de vagas deve ser um número inteiro.' })
        .min(1, { message: 'Deve haver pelo menos 1 vaga.' })
        .max(9999999999, { message: 'Número de vagas deve ter no máximo 10 dígitos.' }),

    courses_id: z.string()
        .uuid({ message: 'ID do curso deve ser um UUID válido.' }),
});

// Schema para criação de turma
export const CreateClassSchema = ClassesSchema.omit({
    id: true,
});

// Schema para atualização de turma
export const UpdateClassSchema = ClassesSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da turma deve ser um UUID válido.' }),
    });

// Tipos TypeScript
export type Class = z.infer<typeof ClassesSchema>;
export type CreateClass = z.infer<typeof CreateClassSchema>;
export type UpdateClass = z.infer<typeof UpdateClassSchema>;