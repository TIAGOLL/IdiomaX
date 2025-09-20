import z from "zod";
import { UpdateUserSchema } from "./entities";
import { UserRoleSchema } from "./get-users";

export const updateUserParams = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
});

export const updateUserQuery = z.object({
    role: UserRoleSchema, // Role obrigatório na query
});

export const updateUserBody = UpdateUserSchema.omit({
    updated_by: true,
    updated_at: true,
});

export const updateUserResponse = z.object({
    message: z.string(),
    user: z.object({
        id: z.uuid(),
        name: z.string(),
        email: z.email(),
    }),
});

export type UpdateUserParams = z.infer<typeof updateUserParams>;
export type UpdateUserQuery = z.infer<typeof updateUserQuery>;
export type UpdateUserBody = z.infer<typeof updateUserBody>;
export type UpdateUserResponse = z.infer<typeof updateUserResponse>;