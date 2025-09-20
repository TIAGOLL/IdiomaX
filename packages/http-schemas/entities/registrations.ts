import { z } from "zod";
import { monetaryDecimalSchema } from "../lib/decimal";
import { auditFieldsSchema, auditFieldsForCreate, auditFieldsForUpdate } from "../lib/audit-fields";

// Schema de matrículas
export const RegistrationsSchema = z.object({
    id: z
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    start_date: z.coerce.date({ message: 'Data de início deve ser uma data válida.' })
        .default(() => new Date()),

    monthly_fee_amount: monetaryDecimalSchema(0, 999999.99)
        .default(0),

    locked: z.boolean()
        .default(false)
        .nullable()
        .optional(),

    completed: z.boolean()
        .default(false)
        .nullable()
        .optional(),

    users_id: z
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' })
        .nullable()
        .optional(),

    companies_id: z
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' })
        .nullable()
        .optional(),
})
    .merge(auditFieldsSchema);

// Schema para criação de matrícula
export const CreateRegistrationSchema = RegistrationsSchema.omit({
    id: true,
}).merge(auditFieldsForCreate);

// Schema para atualização de matrícula
export const UpdateRegistrationSchema = RegistrationsSchema.partial()
    .safeExtend({
        id: z.uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),
    })
    .merge(auditFieldsForUpdate);

// Schema para trancar matrícula
export const LockRegistrationSchema = z.object({
    id: z
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    locked: z.boolean()
        .default(true),
});

// Schema para concluir matrícula
export const CompleteRegistrationSchema = z.object({
    id: z
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