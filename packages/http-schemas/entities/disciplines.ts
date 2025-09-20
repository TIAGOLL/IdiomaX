import { z } from "zod";
import { auditFieldsSchema, auditFieldsForCreate, auditFieldsForUpdate } from "../lib/audit-fields";

// Schema de disciplinas
export const DisciplinesSchema = z.object({
    id: z
        .uuid({ message: 'ID da disciplina deve ser um UUID válido.' }),

    name: z.string()
        .min(2, { message: 'Nome da disciplina deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome da disciplina deve ter no máximo 256 caracteres.' }),

    levels_id: z
        .uuid({ message: 'ID do nível deve ser um UUID válido.' }),
})
    .merge(auditFieldsSchema);

// Schema para criação de disciplina
export const CreateDisciplineSchema = DisciplinesSchema.omit({
    id: true,
}).merge(auditFieldsForCreate);

// Schema para atualização de disciplina
export const UpdateDisciplineSchema = DisciplinesSchema.partial()
    .safeExtend({
        id: z.uuid({ message: 'ID da disciplina deve ser um UUID válido.' }),
    })
    .merge(auditFieldsForUpdate);

// Tipos TypeScript
export type Discipline = z.infer<typeof DisciplinesSchema>;
export type CreateDiscipline = z.infer<typeof CreateDisciplineSchema>;
export type UpdateDiscipline = z.infer<typeof UpdateDisciplineSchema>;