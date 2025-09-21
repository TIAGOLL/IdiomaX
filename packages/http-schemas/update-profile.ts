import { z } from "zod";
import { UpdateUserSchema, GenderSchema } from "./entities/users";

// Schema específico para atualização de perfil de usuário
// Remove campos problemáticos de auditoria que causam conflitos de tipo
export const updateUserProfileRequest = z.object({
    name: z.string()
        .min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome deve ter no máximo 256 caracteres.' })
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'Nome deve conter apenas letras e espaços.' })
        .optional(),

    cpf: z.string()
        .length(11, { message: 'CPF deve ter exatamente 11 dígitos.' })
        .regex(/^\d{11}$/, { message: 'CPF deve conter apenas números.' })
        .optional(),

    phone: z.string()
        .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' })
        .max(15, { message: 'Telefone deve ter no máximo 15 dígitos.' })
        .regex(/^\d+$/, { message: 'Telefone deve conter apenas números.' })
        .optional(),

    gender: GenderSchema.optional(),

    date_of_birth: z.preprocess(
        (val) => {
            if (val instanceof Date) return val;
            if (typeof val === 'string') return new Date(val);
            return val;
        },
        z.date()
            .min(new Date('1900-01-01'), { message: 'Data de nascimento deve ser a partir de 01/01/1900.' })
            .max(new Date(), { message: 'Data de nascimento não pode ser uma data futura.' })
            .refine((date) => {
                const today = new Date();
                const age = today.getFullYear() - date.getFullYear();
                const monthDiff = today.getMonth() - date.getMonth();
                const dayDiff = today.getDate() - date.getDate();
                return age > 0 || (age === 0 && monthDiff > 0) || (age === 0 && monthDiff === 0 && dayDiff >= 0);
            }, { message: 'Usuário deve ter pelo menos 1 ano.' })
    ).optional(),

    address: z.string()
        .min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' })
        .max(256, { message: 'Endereço deve ter no máximo 256 caracteres.' })
        .optional(),

    avatar_url: z.string()
        .url({ message: 'URL do avatar deve ser uma URL válida.' })
        .max(1024, { message: 'URL do avatar deve ter no máximo 1024 caracteres.' })
        .nullable()
        .optional(),
});

export const updateUserProfileResponse = z.object({
    message: z.string(),
});