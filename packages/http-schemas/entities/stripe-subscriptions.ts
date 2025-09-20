import { z } from "zod";

// Enum para status da assinatura no Stripe
export const StripeSubscriptionStatusSchema = z.enum([
    'trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid'
], {
    message: 'Status da assinatura deve ser um valor válido (trialing, active, canceled, etc.).'
});

// Schema de assinaturas da empresa no Stripe
export const StripeCompanySubscriptionSchema = z.object({
    id: z.string()
        .min(1, { message: 'ID da assinatura é obrigatório.' })
        .max(256, { message: 'ID da assinatura deve ter no máximo 256 caracteres.' })
        .regex(/^sub_[a-zA-Z0-9]{24}$/, { message: 'ID da assinatura deve ter o formato válido do Stripe (sub_...).' }),

    company_customer_id: z.string()
        .uuid({ message: 'ID do cliente da empresa deve ser um UUID válido.' }),

    status: StripeSubscriptionStatusSchema,

    price_id: z.string()
        .min(1, { message: 'ID do preço é obrigatório.' })
        .max(256, { message: 'ID do preço deve ter no máximo 256 caracteres.' }),

    quantity: z.number()
        .int({ message: 'Quantidade deve ser um número inteiro.' })
        .min(1, { message: 'Quantidade deve ser pelo menos 1.' })
        .nullable()
        .optional(),

    cancel_at_period_end: z.boolean()
        .nullable()
        .optional(),

    metadata: z.record(z.string(), z.any())
        .nullable()
        .optional(),

    created: z.coerce.date({ message: 'Data de criação deve ser uma data válida.' })
        .default(() => new Date()),

    current_period_start: z.coerce.date({ message: 'Início do período atual deve ser uma data válida.' })
        .nullable()
        .optional(),

    current_period_end: z.coerce.date({ message: 'Fim do período atual deve ser uma data válida.' })
        .nullable()
        .optional(),

    ended_at: z.coerce.date({ message: 'Data de término deve ser uma data válida.' })
        .nullable()
        .optional(),

    cancel_at: z.coerce.date({ message: 'Data de cancelamento deve ser uma data válida.' })
        .nullable()
        .optional(),

    canceled_at: z.coerce.date({ message: 'Data de cancelamento deve ser uma data válida.' })
        .nullable()
        .optional(),

    trial_start: z.coerce.date({ message: 'Início do período de teste deve ser uma data válida.' })
        .nullable()
        .optional(),

    trial_end: z.coerce.date({ message: 'Fim do período de teste deve ser uma data válida.' })
        .nullable()
        .optional(),
}).refine((data) => {
    if (data.current_period_start && data.current_period_end) {
        return data.current_period_start < data.current_period_end;
    }
    return true;
}, {
    message: 'Início do período deve ser anterior ao fim do período.',
    path: ['current_period_start'],
}).refine((data) => {
    if (data.trial_start && data.trial_end) {
        return data.trial_start < data.trial_end;
    }
    return true;
}, {
    message: 'Início do teste deve ser anterior ao fim do teste.',
    path: ['trial_start'],
});

// Schema para criação de assinatura
export const CreateStripeCompanySubscriptionSchema = StripeCompanySubscriptionSchema.omit({
    id: true,
    created: true,
});

// Schema para atualização de assinatura
export const UpdateStripeCompanySubscriptionSchema = StripeCompanySubscriptionSchema.partial()
    .extend({
        id: z.string().min(1, { message: 'ID da assinatura é obrigatório.' }),
    })
    .omit({
        created: true,
    });

// Schema para cancelamento de assinatura
export const CancelStripeSubscriptionSchema = z.object({
    id: z.string()
        .min(1, { message: 'ID da assinatura é obrigatório.' }),

    cancel_at_period_end: z.boolean()
        .default(true),

    cancellation_reason: z.string()
        .min(1, { message: 'Motivo do cancelamento é obrigatório.' })
        .max(500, { message: 'Motivo do cancelamento deve ter no máximo 500 caracteres.' })
        .optional(),
});

// Schema para reativar assinatura
export const ReactivateStripeSubscriptionSchema = z.object({
    id: z.string()
        .min(1, { message: 'ID da assinatura é obrigatório.' }),

    price_id: z.string()
        .min(1, { message: 'ID do preço é obrigatório.' })
        .optional(),
});

// Tipos TypeScript
export type StripeCompanySubscription = z.infer<typeof StripeCompanySubscriptionSchema>;
export type CreateStripeCompanySubscription = z.infer<typeof CreateStripeCompanySubscriptionSchema>;
export type UpdateStripeCompanySubscription = z.infer<typeof UpdateStripeCompanySubscriptionSchema>;
export type CancelStripeSubscription = z.infer<typeof CancelStripeSubscriptionSchema>;
export type ReactivateStripeSubscription = z.infer<typeof ReactivateStripeSubscriptionSchema>;
export type StripeSubscriptionStatus = z.infer<typeof StripeSubscriptionStatusSchema>;