import { z } from "zod";
import { monetaryDecimalSchema } from "../lib/decimal";
import { auditFieldsSchema, auditFieldsForCreate, auditFieldsForUpdate } from "../lib/audit-fields";

// Schema de mensalidades
export const MonthlyFeeSchema = z.object({
    id: z
        .uuid({ message: 'ID da mensalidade deve ser um UUID válido.' }),

    due_date: z.coerce.date({ message: 'Data de vencimento deve ser uma data válida.' }),

    value: monetaryDecimalSchema(0.01, 9999999.99),

    paid: z.boolean()
        .default(false),

    discount_payment_before_due_date: monetaryDecimalSchema(0, 9999999.99)
        .default(0),

    payment_method: z.string()
        .min(1, { message: 'Método de pagamento deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Método de pagamento deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    date_of_payment: z.coerce.date({ message: 'Data de pagamento deve ser uma data válida.' })
        .nullable()
        .optional(),

    registrations_id: z
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),
})
    .merge(auditFieldsSchema);

// Schema para criação de mensalidade
export const CreateMonthlyFeeSchema = MonthlyFeeSchema.omit({
    id: true,
}).merge(auditFieldsForCreate);

// Schema para atualização de mensalidade
export const UpdateMonthlyFeeSchema = MonthlyFeeSchema.partial()
    .safeExtend({
        id: z.uuid({ message: 'ID da mensalidade deve ser um UUID válido.' }),
    })
    .merge(auditFieldsForUpdate);

// Schema para pagamento de mensalidade
export const PayMonthlyFeeSchema = z.object({
    id: z
        .uuid({ message: 'ID da mensalidade deve ser um UUID válido.' }),

    payment_method: z.string()
        .min(1, { message: 'Método de pagamento é obrigatório.' })
        .max(256, { message: 'Método de pagamento deve ter no máximo 256 caracteres.' }),

    date_of_payment: z.coerce.date({ message: 'Data de pagamento deve ser uma data válida.' })
        .default(() => new Date()),

    paid: z.boolean()
        .default(true),
});

// Schema para geração de mensalidades em lote
export const GenerateMonthlyFeesSchema = z.object({
    registrations_id: z
        .uuid({ message: 'ID da matrícula deve ser um UUID válido.' }),

    months: z.number()
        .int({ message: 'Número de meses deve ser um número inteiro.' })
        .min(1, { message: 'Deve gerar pelo menos 1 mês.' })
        .max(12, { message: 'Pode gerar no máximo 12 meses.' }),

    value: z.number()
        .min(0.01, { message: 'Valor da mensalidade deve ser maior que zero.' })
        .max(9999999.99, { message: 'Valor da mensalidade deve ser no máximo R$ 9.999.999,99.' }),

    start_date: z.coerce.date({ message: 'Data de início deve ser uma data válida.' })
        .default(() => new Date()),
});

// Tipos TypeScript
export type MonthlyFee = z.infer<typeof MonthlyFeeSchema>;
export type CreateMonthlyFee = z.infer<typeof CreateMonthlyFeeSchema>;
export type UpdateMonthlyFee = z.infer<typeof UpdateMonthlyFeeSchema>;
export type PayMonthlyFee = z.infer<typeof PayMonthlyFeeSchema>;
export type GenerateMonthlyFees = z.infer<typeof GenerateMonthlyFeesSchema>;