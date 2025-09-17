import { z } from "zod";

export const passwordRecoverRequest = z.object({
    email: z.email(),
});

export const passwordRecoverResponse201 = z.object({
    message: z.string(),
});