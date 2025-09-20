import z from "zod";
import { UserRoleSchema } from "./get-users";

export const deactivateUserParams = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
});

export const deactivateUserQuery = z.object({
    role: UserRoleSchema, // Role obrigatório na query
});

export const deactivateUserResponse = z.object({
    message: z.string(),
});

export type DeactivateUserParams = z.infer<typeof deactivateUserParams>;
export type DeactivateUserQuery = z.infer<typeof deactivateUserQuery>;
export type DeactivateUserResponse = z.infer<typeof deactivateUserResponse>;