import { z } from "zod";

// Schema de registros de estudantes
export const RecordsOfStudentsSchema = z.object({
    id: z
        .uuid({ message: 'ID do registro deve ser um UUID válido.' }),

    title: z.string()
        .min(1, { message: 'Título deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Título deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    description: z.string()
        .min(1, { message: 'Descrição deve ter pelo menos 1 caractere.' })
        .max(512, { message: 'Descrição deve ter no máximo 512 caracteres.' })
        .nullable()
        .optional(),

    registrations_id: z
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    created_at: z.coerce.date()
        .default(() => new Date())
        .nullable()
        .optional(),
});

// Schema para criação de registro
export const CreateRecordOfStudentSchema = RecordsOfStudentsSchema.omit({
    id: true,
    created_at: true,
});

// Schema para atualização de registro
export const UpdateRecordOfStudentSchema = RecordsOfStudentsSchema.partial()
    .safeExtend({
        id: z.uuid({ message: 'ID do registro deve ser um UUID válido.' }),
    })
    .omit({
        created_at: true,
    });

// Schema para registro de ocorrência
export const CreateOccurrenceSchema = z.object({
    title: z.string()
        .min(1, { message: 'Título é obrigatório.' })
        .max(256, { message: 'Título deve ter no máximo 256 caracteres.' }),

    description: z.string()
        .min(10, { message: 'Descrição deve ter pelo menos 10 caracteres.' })
        .max(512, { message: 'Descrição deve ter no máximo 512 caracteres.' }),

    registrations_id: z
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),
});

// Schema para registro de observação
export const CreateObservationSchema = z.object({
    title: z.string()
        .min(1, { message: 'Título é obrigatório.' })
        .max(256, { message: 'Título deve ter no máximo 256 caracteres.' }),

    description: z.string()
        .min(5, { message: 'Observação deve ter pelo menos 5 caracteres.' })
        .max(512, { message: 'Observação deve ter no máximo 512 caracteres.' }),

    registrations_id: z
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),
});

// Tipos TypeScript
export type RecordOfStudent = z.infer<typeof RecordsOfStudentsSchema>;
export type CreateRecordOfStudent = z.infer<typeof CreateRecordOfStudentSchema>;
export type UpdateRecordOfStudent = z.infer<typeof UpdateRecordOfStudentSchema>;
export type CreateOccurrence = z.infer<typeof CreateOccurrenceSchema>;
export type CreateObservation = z.infer<typeof CreateObservationSchema>;