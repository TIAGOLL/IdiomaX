import { z } from "zod";

export const studentsUpdatePasswordSchema = z.object({
    password: z.string().min(6, "Senha deve conter no mínimo 6 caracteres"),
    email: z.email("Email inválido"),
});