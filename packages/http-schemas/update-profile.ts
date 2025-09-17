import z from "zod";

export const updateUserProfileRequest = z.object({
    name: z.string().min(3).max(256),
    cpf: z.string().min(11).max(11),
    phone: z.string().min(10).max(11),
    gender: z.string().min(1).max(1),
    date_of_birth: z.string(),
    address: z.string().min(1).max(255),
    avatar_url: z.url().optional(),
})

export const updateUserProfileResponse = z.object({
    message: z.string(),
})