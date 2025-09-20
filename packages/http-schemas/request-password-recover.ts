import { z } from "zod";
import { UsersSchema } from "./entities";

export const passwordRecoverRequest = z.object({
    email: UsersSchema.shape.email,
});

export const passwordRecoverResponse = z.object({
    message: z.string(),
});