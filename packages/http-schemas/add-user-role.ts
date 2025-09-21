import z from "zod";
import { UserRoleSchema } from "./get-users";

export const addUserRoleBody = z.object({
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
    role: UserRoleSchema,
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
});

export const addUserRoleResponse = z.object({
    message: z.string(),
});

export type AddUserRoleBody = z.infer<typeof addUserRoleBody>;
export type AddUserRoleResponse = z.infer<typeof addUserRoleResponse>;