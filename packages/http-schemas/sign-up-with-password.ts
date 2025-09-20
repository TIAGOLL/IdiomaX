import { z } from "zod";
import { UserRegistrationSchema } from "./entities";

export const signUpWithPasswordRequest = UserRegistrationSchema;

export const signUpWithPasswordResponse = z.object({
    message: z.string(),
    token: z.string(),
})
