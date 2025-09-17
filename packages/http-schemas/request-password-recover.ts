import { z } from "zod";

export const passwordRecoverRequest = z.object({
    email: z.email(),
});

export const passwordRecoverResponse = z.object({
    message: z.string(),
});