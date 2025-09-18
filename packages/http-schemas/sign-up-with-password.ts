import z from "zod";
import { differenceInYears } from 'date-fns';

export const signUpWithPasswordRequest = z.object({
    name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }).max(256),
    email: z.email({ message: 'Email inválido.' }).min(3, { message: 'Email deve ter pelo menos 3 caracteres.' }).max(256),
    username: z.string().min(3, { message: 'Nome de usuário deve ter pelo menos 3 caracteres.' }).max(100),
    cpf: z.string().min(11, { message: 'CPF deve ter 11 caracteres.' }).max(11),
    phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 caracteres.' }).max(11),
    gender: z.enum(['M', 'F'], { message: 'Gênero inválido.' }),
    date_of_birth: z.preprocess(
        (arg) => typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg,
        z.date().refine(
            (date) => differenceInYears(new Date(), date) >= 18,
            { message: 'Você deve ter pelo menos 18 anos.' }
        )
    ),
    address: z.string().min(1, { message: 'Endereço é obrigatório.' }).max(255),
    password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }).max(128),
});

export const signUpWithPasswordResponse = z.object({
    message: z.string(),
    token: z.string(),
})
