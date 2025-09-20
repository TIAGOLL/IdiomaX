import z from "zod";
import { UserRoleSchema } from "./get-users";

export const UsersFilterSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    course: z.string().optional(),
    role: UserRoleSchema, // Role obrigatório
});

export type UsersFilterType = z.infer<typeof UsersFilterSchema>;