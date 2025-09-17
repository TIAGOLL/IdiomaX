import { z } from "zod";

export const resetPasswordRequest = z.object({
    token: z.string().min(1, 'Token é obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});

export const resetPasswordResponse = z.object({
    message: z.string(),
});