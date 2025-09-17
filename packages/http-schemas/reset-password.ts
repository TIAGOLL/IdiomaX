import { z } from "zod";

export const resetPasswordRequest = z.object({
    token: z.string().min(1, 'Token é obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});

export const resetPasswordResponse200 = z.object({
    message: z.string(),
});

export const resetPasswordResponse400 = z.object({
    message: z.string(),
});

export const resetPasswordResponse403 = z.object({
    message: z.string(),
});