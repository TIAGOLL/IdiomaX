import { z } from 'zod';

export const authFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .max(255, 'Máximo 255 caracteres')
    .trim()
    .optional(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').trim().optional(),
});
