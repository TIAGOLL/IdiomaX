import z from "zod";
import { UserRoleSchema } from "./get-users";

export const removeUserRoleBody = z.object({
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
    role: UserRoleSchema,
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
});

export const removeUserRoleResponse = z.object({
    message: z.string(),
});

export type RemoveUserRoleBody = z.infer<typeof removeUserRoleBody>;
export type RemoveUserRoleResponse = z.infer<typeof removeUserRoleResponse>;