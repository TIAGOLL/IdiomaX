import { z } from "zod";

// Schema de turmas
export const ClassesSchema = z.object({
    id: z
        .uuid({ message: 'ID da turma deve ser um UUID válido.' }),

    nome: z.string()
        .min(2, { message: 'Nome da turma deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome da turma deve ter no máximo 256 caracteres.' }),

    vacancies: z.number()
        .int({ message: 'Número de vagas deve ser um número inteiro.' })
        .min(1, { message: 'Deve haver pelo menos 1 vaga.' })
        .max(99999, { message: 'Número de vagas deve ter no máximo 5 dígitos.' }),

    courses_id: z
        .uuid({ message: 'ID do curso deve ser um UUID válido.' }),
});

// Schema para criação de turma
export const CreateClassSchema = ClassesSchema.omit({
    id: true,
});

// Schema para atualização de turma
export const UpdateClassSchema = ClassesSchema.partial()
    .safeExtend({
        id: z.uuid({ message: 'ID da turma deve ser um UUID válido.' }),
    });

// Tipos TypeScript
export type Class = z.infer<typeof ClassesSchema>;
export type CreateClass = z.infer<typeof CreateClassSchema>;
export type UpdateClass = z.infer<typeof UpdateClassSchema>;