import { z } from "zod";

// Schema de disciplinas
export const DisciplinesSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da disciplina deve ser um UUID válido.' }),

    name: z.string()
        .min(2, { message: 'Nome da disciplina deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome da disciplina deve ter no máximo 256 caracteres.' }),

    levels_id: z.string()
        .uuid({ message: 'ID do nível deve ser um UUID válido.' }),
});

// Schema para criação de disciplina
export const CreateDisciplineSchema = DisciplinesSchema.omit({
    id: true,
});

// Schema para atualização de disciplina
export const UpdateDisciplineSchema = DisciplinesSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da disciplina deve ser um UUID válido.' }),
    });

// Tipos TypeScript
export type Discipline = z.infer<typeof DisciplinesSchema>;
export type CreateDiscipline = z.infer<typeof CreateDisciplineSchema>;
export type UpdateDiscipline = z.infer<typeof UpdateDisciplineSchema>;