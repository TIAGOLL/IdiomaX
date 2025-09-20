import { z } from "zod";
import { UsersSchema } from "./entities";

export const signInWithPasswordResponse = z.object({
    message: z.string(),
    token: z.string(),
});

export const signInWithPasswordRequest = z.object({
    username: UsersSchema.shape.username,
    password: UsersSchema.shape.password,
})