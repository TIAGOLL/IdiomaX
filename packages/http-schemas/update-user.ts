import z from "zod";
import { UpdateUserSchema } from "./entities";
import { UserRoleSchema } from "./get-users";

export const updateUserBody = UpdateUserSchema.omit({
    updated_by: true,
    updated_at: true,
}).extend({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    role: UserRoleSchema, // Role obrigatório no body
});

export const updateUserResponse = z.object({
    message: z.string(),
    user: z.object({
        id: z.uuid(),
        name: z.string(),
        email: z.email(),
    }),
});

export type UpdateUserBody = z.infer<typeof updateUserBody>;
export type UpdateUserResponse = z.infer<typeof updateUserResponse>;