import { z } from "zod";
import { auditFieldsSchema, auditFieldsForCreate, auditFieldsForUpdate } from "../lib/audit-fields";

// Enum para Gênero
export const GenderSchema = z.enum(['M', 'F'], {
    message: 'Gênero deve ser Masculino (M) ou Feminino (F).'
});

// Schema principal do usuário
export const UsersSchema = z.object({
    id: z
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    name: z.string()
        .min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome deve ter no máximo 256 caracteres.' })
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'Nome deve conter apenas letras e espaços.' }),

    email: z
        .email({ message: 'Email deve ser um endereço válido.' })
        .max(256, { message: 'Email deve ter no máximo 256 caracteres.' }),

    password: z.string()
        .min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' })
        .max(1024, { message: 'Senha deve ter no máximo 1024 caracteres.' }),

    cpf: z.string()
        .length(11, { message: 'CPF deve ter exatamente 11 dígitos.' })
        .regex(/^\d{11}$/, { message: 'CPF deve conter apenas números.' }),

    phone: z.string()
        .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos.' })
        .max(15, { message: 'Telefone deve ter no máximo 15 dígitos.' })
        .regex(/^\d+$/, { message: 'Telefone deve conter apenas números.' }),

    username: z.string()
        .min(3, { message: 'Nome de usuário deve ter pelo menos 3 caracteres.' })
        .max(256, { message: 'Nome de usuário deve ter no máximo 256 caracteres.' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Nome de usuário deve conter apenas letras, números e underscore.' }),

    gender: GenderSchema,

    date_of_birth: z.date()
        .min(new Date('1900-01-01'), { message: 'Data de nascimento deve ser a partir de 01/01/1900.' })
        .max(new Date(), { message: 'Data de nascimento não pode ser uma data futura.' })
        .min(1, { message: 'Data de nascimento é obrigatória.' })
        .refine((date) => {
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();
            const dayDiff = today.getDate() - date.getDate();
            return age > 0 || (age === 0 && monthDiff > 0) || (age === 0 && monthDiff === 0 && dayDiff >= 0);
        }, { message: 'Usuário deve ter pelo menos 1 ano.' }),

    address: z.string()
        .min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' })
        .max(256, { message: 'Endereço deve ter no máximo 256 caracteres.' }),

    avatar_url: z
        .url({ message: 'URL do avatar deve ser uma URL válida.' })
        .max(1024, { message: 'URL do avatar deve ter no máximo 1024 caracteres.' })
        .nullable()
        .optional(),
})
    .merge(auditFieldsSchema);

// Schema para criação de usuário (sem campos automáticos)
export const CreateUserSchema = UsersSchema.omit({
    id: true,
}).merge(auditFieldsForCreate);

// Schema para atualização de usuário (todos os campos opcionais exceto ID)
export const UpdateUserSchema = UsersSchema.omit({
    created_at: true,
    created_by: true,
}).partial().extend({
    id: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
}).merge(auditFieldsForUpdate);

// Schema para formulário de registro público
export const UserRegistrationSchema = CreateUserSchema.omit({
    active: true,
    avatar_url: true,
});

// Schema para perfil público do usuário
export const UserProfileSchema = UsersSchema.omit({
    password: true,
});

// Tipos TypeScript
export type User = z.infer<typeof UsersSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Gender = z.infer<typeof GenderSchema>;