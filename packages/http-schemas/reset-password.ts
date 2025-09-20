import { z } from "zod";
import { UsersSchema } from "./entities";

export const resetPasswordRequest = z.object({
    token: z.string().min(1, 'Token é obrigatório'),
    password: UsersSchema.shape.password,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});

export const resetPasswordResponse = z.object({
    message: z.string(),
});