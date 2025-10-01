import { z } from 'zod';
import { GenderEnum, WeekDaysEnum } from '../enums';

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
    })).optional(),
    users_in_class: z.array(
        z.object({
            id: z.string(),
            users: z.object({
                id: z.string().uuid(),
                name: z.string(),
                email: z.string().email(),
                cpf: z.string(),
                phone: z.string(),
                username: z.string(),
                gender: GenderEnum,
                date_of_birth: z.date(),
                address: z.string(),
                avatar_url: z.string().nullable(),
                active: z.boolean(),
            }),
            teacher: z.boolean(),
        })
    )
});

export type GetClassByIdRequestType = z.infer<typeof GetClassByIdApiRequestSchema>;
export type GetClassByIdResponseType = z.infer<typeof GetClassByIdApiResponseSchema>;
