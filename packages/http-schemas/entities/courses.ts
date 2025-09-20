import { z } from "zod";

// Schema de cursos
export const CoursesSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID do curso deve ser um UUID válido.' }),

    name: z.string()
        .min(2, { message: 'Nome do curso deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome do curso deve ter no máximo 256 caracteres.' }),

    description: z.string()
        .min(1, { message: 'Descrição deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Descrição deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    registration_value: z.number()
        .min(0, { message: 'Valor da matrícula deve ser maior ou igual a zero.' })
        .max(999999.99, { message: 'Valor da matrícula deve ser no máximo R$ 999.999,99.' }),

    workload: z.number()
        .int({ message: 'Carga horária deve ser um número inteiro.' })
        .min(1, { message: 'Carga horária deve ser pelo menos 1 hora.' })
        .max(99999, { message: 'Carga horária deve ter no máximo 5 dígitos.' }),

    monthly_fee_value: z.number()
        .min(0, { message: 'Valor da mensalidade deve ser maior ou igual a zero.' })
        .max(999999.99, { message: 'Valor da mensalidade deve ser no máximo R$ 999.999,99.' }),

    minimum_grade: z.number()
        .min(0, { message: 'Nota mínima deve ser maior ou igual a zero.' })
        .max(100, { message: 'Nota mínima deve ser no máximo 100.' }),

    maximum_grade: z.number()
        .min(0, { message: 'Nota máxima deve ser maior ou igual a zero.' })
        .max(100, { message: 'Nota máxima deve ser no máximo 100.' }),

    minimum_frequency: z.number()
        .min(0, { message: 'Frequência mínima deve ser maior ou igual a zero.' })
        .max(100, { message: 'Frequência mínima deve ser no máximo 100%.' }),

    syllabus: z.string().base64({ message: 'Ementa deve ser um arquivo válido em base64.' })
        .nullable()
        .optional(),

    companies_id: z.string()
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),

    created_at: z.coerce.date()
        .default(() => new Date()),
}).refine((data) => data.minimum_grade <= data.maximum_grade, {
    message: 'Nota mínima deve ser menor ou igual à nota máxima.',
    path: ['minimum_grade'],
});

// Schema para criação de curso
export const CreateCourseSchema = CoursesSchema.omit({
    id: true,
    created_at: true,
});

// Schema para atualização de curso
export const UpdateCourseSchema = CoursesSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID do curso deve ser um UUID válido.' }),
    })
    .omit({
        created_at: true,
    });

// Tipos TypeScript
export type Course = z.infer<typeof CoursesSchema>;
export type CreateCourse = z.infer<typeof CreateCourseSchema>;
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;