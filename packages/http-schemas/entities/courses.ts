import { z } from "zod";
import { monetaryDecimalSchema, integerDecimalSchema, percentageDecimalSchema } from "../lib/decimal";
import { auditFieldsSchema, auditFieldsForCreate, auditFieldsForUpdate } from "../lib/audit-fields";

// Schema de cursos
export const CoursesSchema = z.object({
    id: z
        .uuid({ message: 'ID do curso deve ser um UUID válido.' }),

    name: z.string()
        .min(2, { message: 'Nome do curso deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome do curso deve ter no máximo 256 caracteres.' }),

    description: z.string()
        .min(1, { message: 'Descrição deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Descrição deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    registration_value: monetaryDecimalSchema(0, 999999.99),

    workload: integerDecimalSchema(1, 99999),

    monthly_fee_value: monetaryDecimalSchema(0, 999999.99),

    minimum_grade: percentageDecimalSchema(),

    maximum_grade: percentageDecimalSchema(),

    minimum_frequency: percentageDecimalSchema(),

    syllabus: z.string().base64({ message: 'Ementa deve ser um arquivo válido em base64.' })
        .nullable()
        .optional(),

    companies_id: z
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
})
    .merge(auditFieldsSchema)
    .refine((data) => data.minimum_grade <= data.maximum_grade, {
        message: 'Nota mínima deve ser menor ou igual à nota máxima.',
        path: ['minimum_grade'],
    });

// Schema para criação de curso
export const CreateCourseSchema = CoursesSchema.omit({
    id: true,
}).merge(auditFieldsForCreate);

// Schema para atualização de curso
export const UpdateCourseSchema = CoursesSchema.omit({
    created_at: true,
    created_by: true,
}).partial().extend({
    id: z.uuid({ message: 'ID do curso deve ser um UUID válido.' }),
}).merge(auditFieldsForUpdate);

// Tipos TypeScript
export type Course = z.infer<typeof CoursesSchema>;
export type CreateCourse = z.infer<typeof CreateCourseSchema>;
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;