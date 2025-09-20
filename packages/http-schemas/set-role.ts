import { z } from "zod";
import { RoleSchema } from "./entities";

export const setRoleRequest = z.object({
    user_id: z.uuid(),
    role: RoleSchema, // Usando o enum de role em vez de role_id
})

export const setRoleResponse = z.object({
    message: z.string(),
})