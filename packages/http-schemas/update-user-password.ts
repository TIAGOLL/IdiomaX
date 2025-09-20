import z from "zod";
import { UserRoleSchema } from "./get-users";

export const updateUserPasswordParams = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
});

export const updateUserPasswordQuery = z.object({
    role: UserRoleSchema, // Role obrigatório na query
});

export const updateUserPasswordBody = z.object({
    currentPassword: z.string()
        .min(1, { message: 'Senha atual é obrigatória.' }),
    newPassword: z.string()
        .min(6, { message: 'Nova senha deve ter pelo menos 6 caracteres.' })
        .max(1024, { message: 'Nova senha deve ter no máximo 1024 caracteres.' }),
});

export const updateUserPasswordResponse = z.object({
    message: z.string(),
});

export type UpdateUserPasswordParams = z.infer<typeof updateUserPasswordParams>;
export type UpdateUserPasswordQuery = z.infer<typeof updateUserPasswordQuery>;
export type UpdateUserPasswordBody = z.infer<typeof updateUserPasswordBody>;
export type UpdateUserPasswordResponse = z.infer<typeof updateUserPasswordResponse>;