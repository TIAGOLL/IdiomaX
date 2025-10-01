import { z } from 'zod';
import { WeekDaysEnum } from '../enums';

export const GetClassByIdApiRequestSchema = z.object({
    class_id: z.string().uuid('ID da turma inválido'),
    company_id: z.string().uuid('ID da empresa inválido')
});

export const GetClassByIdApiResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    vacancies: z.number(),
    course_id: z.string(),
    active: z.boolean(),
    created_at: z.date(),
    updated_at: z.date(),
    created_by: z.string(),
    updated_by: z.string(),
    courses: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        workload: z.number(),
        minimum_grade: z.number(),
        maximum_grade: z.number(),
        minimum_frequency: z.number(),
        syllabus_url: z.string().nullable(),
        company_id: z.string(),
        active: z.boolean(),
        created_at: z.date(),
        updated_at: z.date()
    }),
    class_days: z.array(z.object({
        id: z.string(),
        week_date: WeekDaysEnum,
    })).optional()
});

export type GetClassByIdRequestType = z.infer<typeof GetClassByIdApiRequestSchema>;
export type GetClassByIdResponseType = z.infer<typeof GetClassByIdApiResponseSchema>;
