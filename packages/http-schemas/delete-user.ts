import z from "zod";
import { UserRoleSchema } from "./get-users";

export const deleteUserBody = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
    role: UserRoleSchema,
});

export const deleteUserResponse = z.object({
    message: z.string(),
});

export type DeleteUserBody = z.infer<typeof deleteUserBody>;
export type DeleteUserResponse = z.infer<typeof deleteUserResponse>;