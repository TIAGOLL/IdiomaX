import z from "zod";
import { UserRoleSchema } from "./get-users";

export const deactivateUserBody = z.object({
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
    role: UserRoleSchema,
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    active: z.boolean({ message: 'Status ativo deve ser um booleano.' }),
});

export const deactivateUserResponse = z.object({
    message: z.string(),
});

export type DeactivateUserBody = z.infer<typeof deactivateUserBody>;
export type DeactivateUserResponse = z.infer<typeof deactivateUserResponse>;