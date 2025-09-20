import { z } from "zod";

// Schema principal de empresas
export const CompaniesSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),

    name: z.string()
        .min(2, { message: 'Nome da empresa deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome da empresa deve ter no máximo 256 caracteres.' }),

    cnpj: z.string()
        .length(14, { message: 'CNPJ deve ter exatamente 14 dígitos.' })
        .regex(/^\d{14}$/, { message: 'CNPJ deve conter apenas números.' }),

    phone: z.string()
        .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' })
        .max(15, { message: 'Telefone deve ter no máximo 15 dígitos.' })
        .regex(/^\d+$/, { message: 'Telefone deve conter apenas números.' }),

    email: z.string()
        .email({ message: 'Email deve ser um endereço válido.' })
        .max(256, { message: 'Email deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    logo_16x16_url: z.string()
        .url({ message: 'URL do logo 16x16 deve ser uma URL válida.' })
        .max(1024, { message: 'URL do logo 16x16 deve ter no máximo 1024 caracteres.' })
        .nullable()
        .optional(),

    logo_512x512_url: z.string()
        .url({ message: 'URL do logo 512x512 deve ser uma URL válida.' })
        .max(1024, { message: 'URL do logo 512x512 deve ter no máximo 1024 caracteres.' })
        .nullable()
        .optional(),

    social_reason: z.string()
        .min(2, { message: 'Razão social deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Razão social deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    state_registration: z.string()
        .min(1, { message: 'Inscrição estadual deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Inscrição estadual deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    tax_regime: z.string()
        .min(1, { message: 'Regime tributário deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Regime tributário deve ter no máximo 256 caracteres.' })
        .nullable()
        .optional(),

    address: z.string()
        .min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' })
        .max(256, { message: 'Endereço deve ter no máximo 256 caracteres.' }),

    owner_id: z.string()
        .uuid({ message: 'ID do proprietário deve ser um UUID válido.' }),

    created_at: z.coerce.date()
        .default(() => new Date())
        .nullable()
        .optional(),

    updated_at: z.coerce.date()
        .nullable()
        .optional(),
});

// Schema para criação de empresa
export const CreateCompanySchema = CompaniesSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});

// Schema para atualização de empresa
export const UpdateCompanySchema = CompaniesSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    })
    .omit({
        created_at: true,
        updated_at: true,
    });

// Tipos TypeScript
export type Company = z.infer<typeof CompaniesSchema>;
export type CreateCompany = z.infer<typeof CreateCompanySchema>;
export type UpdateCompany = z.infer<typeof UpdateCompanySchema>;