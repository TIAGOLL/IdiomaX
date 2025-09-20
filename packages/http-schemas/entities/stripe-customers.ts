import { z } from "zod";

// Schema de clientes da empresa no Stripe
export const StripeCompanyCustomerSchema = z.object({
    company_id: z
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),

    stripe_customer_id: z.string()
        .min(1, { message: 'ID do cliente no Stripe é obrigatório.' })
        .max(256, { message: 'ID do cliente no Stripe deve ter no máximo 256 caracteres.' })
});

// Schema para criação de cliente
export const CreateStripeCompanyCustomerSchema = StripeCompanyCustomerSchema;

// Schema para atualização de cliente
export const UpdateStripeCompanyCustomerSchema = StripeCompanyCustomerSchema.partial()
    .safeExtend({
        company_id: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    });

// Tipos TypeScript
export type StripeCompanyCustomer = z.infer<typeof StripeCompanyCustomerSchema>;
export type CreateStripeCompanyCustomer = z.infer<typeof CreateStripeCompanyCustomerSchema>;
export type UpdateStripeCompanyCustomer = z.infer<typeof UpdateStripeCompanyCustomerSchema>;