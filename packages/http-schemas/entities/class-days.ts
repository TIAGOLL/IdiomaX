import { z } from "zod";

// Enum para dias da semana
export const WeekDaysSchema = z.enum([
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
], {
    message: 'Dia da semana deve ser um valor válido (SUNDAY a SATURDAY).'
});

// Schema de dias de aula
export const ClassDaysSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID do dia de aula deve ser um UUID válido.' }),

    week_date: WeekDaysSchema,

    class_id: z.string()
        .uuid({ message: 'ID da turma deve ser um UUID válido.' }),
});

// Schema para criação de dia de aula
export const CreateClassDaySchema = ClassDaysSchema.omit({
    id: true,
});

// Schema para atualização de dia de aula
export const UpdateClassDaySchema = ClassDaysSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID do dia de aula deve ser um UUID válido.' }),
    });

// Tipos TypeScript
export type ClassDay = z.infer<typeof ClassDaysSchema>;
export type CreateClassDay = z.infer<typeof CreateClassDaySchema>;
export type UpdateClassDay = z.infer<typeof UpdateClassDaySchema>;
export type WeekDay = z.infer<typeof WeekDaysSchema>;