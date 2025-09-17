import z from "zod";

export const setRoleRequest = z.object({
    user_id: z.string(),
    role_id: z.string(),
})

export const setRoleResponse = z.object({
    message: z.string(),
})