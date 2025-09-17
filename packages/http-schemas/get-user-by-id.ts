import z from "zod";

export const getUserByIdRequest = z.object({
    id: z.uuid(),
})

export const getUserByIdResponse = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
    cpf: z.string(),
    phone: z.string(),
    gender: z.string(),
    date_of_birth: z.coerce.date(),
    address: z.string(),
    active: z.boolean(),
    avatar_url: z.url().nullable(),
    created_at: z.date().nullable(),
    updated_at: z.date().nullable(),
})