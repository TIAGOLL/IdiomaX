import { z } from "zod";

// Enum para Gênero
export const GenderSchema = z.enum(['M', 'F'], {
    message: 'Gênero deve ser Masculino (M) ou Feminino (F).'
});

// Schema principal do usuário
export const UsersSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    name: z.string()
        .min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
        .max(256, { message: 'Nome deve ter no máximo 256 caracteres.' })
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'Nome deve conter apenas letras e espaços.' }),

    email: z.string()
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

    date_of_birth: z.coerce.date({ message: 'Data de nascimento deve ser uma data válida.' })
        .refine((date) => {
            const age = new Date().getFullYear() - date.getFullYear();
            return age >= 16;
        }, { message: 'Usuário deve ter pelo menos 16 anos.' }),

    address: z.string()
        .min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' })
        .max(256, { message: 'Endereço deve ter no máximo 256 caracteres.' }),

    active: z.boolean()
        .default(true)
        .nullable(),

    avatar_url: z.string()
        .url({ message: 'URL do avatar deve ser uma URL válida.' })
        .max(1024, { message: 'URL do avatar deve ter no máximo 1024 caracteres.' })
        .nullable()
        .optional(),

    created_at: z.coerce.date()
        .default(() => new Date())
        .nullable()
        .optional(),

    updated_at: z.coerce.date()
        .nullable()
        .optional(),
});

// Schema para criação de usuário (sem campos automáticos)
export const CreateUserSchema = UsersSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});

// Schema para atualização de usuário (todos os campos opcionais exceto ID)
export const UpdateUserSchema = UsersSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
    })
    .omit({
        created_at: true,
        updated_at: true,
    });

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