import z from "zod";
import { UserRoleSchema } from "./get-users";

export const updateUserPasswordBody = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
    role: UserRoleSchema, // Role obrigatório no body
    currentPassword: z.string()
        .min(1, { message: 'Senha atual é obrigatória.' }),
    newPassword: z.string()
        .min(6, { message: 'Nova senha deve ter pelo menos 6 caracteres.' })
        .max(1024, { message: 'Nova senha deve ter no máximo 1024 caracteres.' }),
});

export const updateUserPasswordResponse = z.object({
    message: z.string(),
});

export type UpdateUserPasswordBody = z.infer<typeof updateUserPasswordBody>;
export type UpdateUserPasswordResponse = z.infer<typeof updateUserPasswordResponse>;