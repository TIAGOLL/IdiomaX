import { z } from "zod";

// Enums para tipos de preço do Stripe
export const StripePricingTypeSchema = z.enum(['one_time', 'recurring'], {
    message: 'Tipo de preço deve ser one_time ou recurring.'
});

export const StripePricingPlanIntervalSchema = z.enum(['day', 'week', 'month', 'year'], {
    message: 'Intervalo do plano deve ser day, week, month ou year.'
});

// Schema de preços do Stripe
export const StripePriceSchema = z.object({
    id: z.string()
        .min(1, { message: 'ID do preço é obrigatório.' })
        .max(256, { message: 'ID do preço deve ter no máximo 256 caracteres.' }),

    product_id: z.string()
        .min(1, { message: 'ID do produto é obrigatório.' })
        .max(256, { message: 'ID do produto deve ter no máximo 256 caracteres.' }),

    active: z.boolean({ message: 'Status ativo deve ser verdadeiro ou falso.' }),

    description: z.string()
        .max(256, { message: 'Descrição deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    unit_amount: z.union([z.bigint(), z.string(), z.number()])
        .transform((val) => {
            if (typeof val === 'bigint') return val.toString();
            if (typeof val === 'number') return val.toString();
            return val;
        })
        .refine((val) => {
            const num = Number(val);
            return !isNaN(num) && num >= 0;
        }, { message: 'Valor unitário deve ser maior ou igual a zero.' }),

    currency: z.string(),

    type: StripePricingTypeSchema,

    interval: StripePricingPlanIntervalSchema
        .nullable()
        .optional(),

    interval_count: z.number()
        .int({ message: 'Contagem do intervalo deve ser um número inteiro.' })
        .min(1, { message: 'Contagem do intervalo deve ser pelo menos 1.' })
        .nullable()
        .optional(),

    trial_period_days: z.number()
        .int({ message: 'Dias de teste deve ser um número inteiro.' })
        .min(0, { message: 'Dias de teste deve ser maior ou igual a zero.' })
        .max(365, { message: 'Dias de teste deve ser no máximo 365.' })
        .nullable()
        .optional(),

    metadata: z.any() // Aceita qualquer tipo de JsonValue do Prisma
        .nullable()
        .optional(),
}).refine((data) => {
    if (data.type === 'recurring') {
        return data.interval !== null && data.interval !== undefined;
    }
    return true;
}, {
    message: 'Intervalo é obrigatório para preços recorrentes.',
    path: ['interval'],
});

// Schema para criação de preço
export const CreateStripePriceSchema = StripePriceSchema.omit({
    id: true,
});

// Schema para atualização de preço
export const UpdateStripePriceSchema = StripePriceSchema.partial()
    .safeExtend({
        id: z.string().min(1, { message: 'ID do preço é obrigatório.' }),
    });

// Tipos TypeScript
export type StripePrice = z.infer<typeof StripePriceSchema>;
export type CreateStripePrice = z.infer<typeof CreateStripePriceSchema>;
export type UpdateStripePrice = z.infer<typeof UpdateStripePriceSchema>;
export type StripePricingType = z.infer<typeof StripePricingTypeSchema>;
export type StripePricingPlanInterval = z.infer<typeof StripePricingPlanIntervalSchema>;