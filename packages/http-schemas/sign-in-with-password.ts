import { z } from "zod";

export const signInWithPasswordResponse = z.object({
    message: z.string(),
    token: z.string(),
});

export const signInWithPasswordRequest = z.object({
    username: z.string(),
    password: z.string().min(6),
})