import { z } from "zod";

// Schema de matrículas
export const RegistrationsSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    start_date: z.coerce.date({ message: 'Data de início deve ser uma data válida.' })
        .default(() => new Date()),

    monthly_fee_amount: z.number()
        .min(0, { message: 'Valor da mensalidade deve ser maior ou igual a zero.' })
        .max(999999.99, { message: 'Valor da mensalidade deve ser no máximo R$ 999.999,99.' })
        .default(0),

    locked: z.boolean()
        .default(false)
        .nullable()
        .optional(),

    completed: z.boolean()
        .default(false)
        .nullable()
        .optional(),

    users_id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' })
        .nullable()
        .optional(),

    companies_id: z.string()
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' })
        .nullable()
        .optional(),

    created_at: z.coerce.date()
        .default(() => new Date())
        .nullable()
        .optional(),
});

// Schema para criação de matrícula
export const CreateRegistrationSchema = RegistrationsSchema.omit({
    id: true,
    created_at: true,
});

// Schema para atualização de matrícula
export const UpdateRegistrationSchema = RegistrationsSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),
    })
    .omit({
        created_at: true,
    });

// Schema para trancar matrícula
export const LockRegistrationSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    locked: z.boolean()
        .default(true),
});

// Schema para concluir matrícula
export const CompleteRegistrationSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    completed: z.boolean()
        .default(true),
});

// Tipos TypeScript
export type Registration = z.infer<typeof RegistrationsSchema>;
export type CreateRegistration = z.infer<typeof CreateRegistrationSchema>;
export type UpdateRegistration = z.infer<typeof UpdateRegistrationSchema>;
export type LockRegistration = z.infer<typeof LockRegistrationSchema>;
export type CompleteRegistration = z.infer<typeof CompleteRegistrationSchema>;