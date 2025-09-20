import { z } from "zod";
import { UpdateUserSchema } from "./entities";

export const updateUserProfileRequest = UpdateUserSchema.omit({
    id: true,
    password: true,
    active: true,
})

export const updateUserProfileResponse = z.object({
    message: z.string(),
})