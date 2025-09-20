import { z } from "zod";

// Schema de produtos do Stripe
export const StripeProductSchema = z.object({
    id: z.string()
        .max(256, { message: 'ID do produto deve ter no máximo 256 caracteres.' }),

    active: z.boolean({ message: 'Status ativo deve ser verdadeiro ou falso.' }),

    name: z.string()
        .max(256, { message: 'Nome do produto deve ter no máximo 256 caracteres.' }),

    description: z.string()
        .max(1024, { message: 'Descrição deve ter no máximo 1024 caracteres.' })
        .nullable()
        .optional(),

    image: z
        .string({ message: 'Imagem deve ser uma URL válida.' })
        .max(1024, { message: 'URL da imagem deve ter no máximo 1024 caracteres.' })
        .nullable()
        .optional(),

    metadata: z.any() // Aceita qualquer tipo de JsonValue do Prisma
        .nullable()
        .optional(),
});

// Schema para criação de produto
export const CreateStripeProductSchema = StripeProductSchema.omit({
    id: true,
});

// Schema para atualização de produto
export const UpdateStripeProductSchema = StripeProductSchema.partial()
    .safeExtend({
        id: z.string().min(1, { message: 'ID do produto é obrigatório.' }),
    });

// Tipos TypeScript
export type StripeProduct = z.infer<typeof StripeProductSchema>;
export type CreateStripeProduct = z.infer<typeof CreateStripeProductSchema>;
export type UpdateStripeProduct = z.infer<typeof UpdateStripeProductSchema>;