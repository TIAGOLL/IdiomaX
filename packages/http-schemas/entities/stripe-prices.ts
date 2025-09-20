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
        .min(1, { message: 'Descrição deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Descrição deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    unit_amount: z.bigint()
        .min(0n, { message: 'Valor unitário deve ser maior ou igual a zero.' }),

    currency: z.string()
        .length(3, { message: 'Moeda deve ter exatamente 3 caracteres.' })
        .regex(/^[A-Z]{3}$/, { message: 'Moeda deve estar em formato ISO (ex: BRL, USD).' }),

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

    metadata: z.record(z.string(), z.any())
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
    .extend({
        id: z.string().min(1, { message: 'ID do preço é obrigatório.' }),
    });

// Tipos TypeScript
export type StripePrice = z.infer<typeof StripePriceSchema>;
export type CreateStripePrice = z.infer<typeof CreateStripePriceSchema>;
export type UpdateStripePrice = z.infer<typeof UpdateStripePriceSchema>;
export type StripePricingType = z.infer<typeof StripePricingTypeSchema>;
export type StripePricingPlanInterval = z.infer<typeof StripePricingPlanIntervalSchema>;