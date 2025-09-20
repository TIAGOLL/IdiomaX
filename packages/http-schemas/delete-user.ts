import z from "zod";
import { UserRoleSchema } from "./get-users";

export const deleteUserParams = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
});

export const deleteUserQuery = z.object({
    role: UserRoleSchema, // Role obrigatório na query
});

export const deleteUserResponse = z.object({
    message: z.string(),
});

export type DeleteUserParams = z.infer<typeof deleteUserParams>;
export type DeleteUserQuery = z.infer<typeof deleteUserQuery>;
export type DeleteUserResponse = z.infer<typeof deleteUserResponse>;