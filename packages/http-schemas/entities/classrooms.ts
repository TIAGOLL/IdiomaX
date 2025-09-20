import { z } from "zod";
import { auditFieldsSchema, auditFieldsForCreate, auditFieldsForUpdate } from "../lib/audit-fields";

// Schema de salas de aula
export const ClassroomsSchema = z.object({
    id: z
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

    companies_id: z
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' })
        .nullable()
        .optional(),
})
    .merge(auditFieldsSchema);

// Schema para criação de sala
export const CreateClassroomSchema = ClassroomsSchema.omit({
    id: true,
}).merge(auditFieldsForCreate);

// Schema para atualização de sala
export const UpdateClassroomSchema = ClassroomsSchema.partial()
    .safeExtend({
        id: z.uuid({ message: 'ID da sala deve ser um UUID válido.' }),
    })
    .merge(auditFieldsForUpdate);

// Tipos TypeScript
export type Classroom = z.infer<typeof ClassroomsSchema>;
export type CreateClassroom = z.infer<typeof CreateClassroomSchema>;
export type UpdateClassroom = z.infer<typeof UpdateClassroomSchema>;