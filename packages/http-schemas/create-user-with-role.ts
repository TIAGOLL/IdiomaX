import { z } from "zod";
import { CreateUserSchema } from "./entities/users";
import { UserRoleSchema } from "./get-users";

// Schema para criação de usuário com role
export const createUserWithRoleRequest = CreateUserSchema.extend({
    role: UserRoleSchema
});

// Schema para response da criação
export const createUserWithRoleResponse = z.object({
    message: z.string(),
    userId: z.uuid().optional(),
});

export type CreateUserWithRoleRequest = z.infer<typeof createUserWithRoleRequest>;
export type CreateUserWithRoleResponse = z.infer<typeof createUserWithRoleResponse>;