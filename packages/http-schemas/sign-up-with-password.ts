import z from "zod";

export const signUpWithPasswordRequest = z.object({
    name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }).max(256),
    email: z.email({ message: 'Email inválido.' }).min(3, { message: 'Email deve ter pelo menos 3 caracteres.' }).max(256),
    username: z.string().min(3, { message: 'Nome de usuário deve ter pelo menos 3 caracteres.' }).max(100),
    cpf: z.string().min(11, { message: 'CPF deve ter 11 caracteres.' }).max(11),
    phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 caracteres.' }).max(11),
    gender: z.string().min(1, { message: 'Gênero é obrigatório.' }).max(1),
    date_of_birth: z.date().refine((date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const month = today.getMonth() - date.getMonth();
        const day = today.getDate() - date.getDate();
        return age > 18 || (age === 18 && (month > 0 || (month === 0 && day >= 0)));
    }, { message: 'Você deve ter pelo menos 18 anos.' }),
    address: z.string().min(1, { message: 'Endereço é obrigatório.' }).max(255),
    password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }).max(128),
    company: z.object({
        name: z.string().min(3, { message: 'Nome da empresa deve ter pelo menos 3 caracteres.' }).max(256),
        cnpj: z.string().min(14, { message: 'CNPJ deve ter 14 caracteres.' }).max(14),
        address: z.string().min(1, { message: 'Endereço da empresa é obrigatório.' }).max(256),
        phone: z.string().min(10, { message: 'Telefone da empresa deve ter pelo menos 10 caracteres.' }).max(15),
    }),
});

export const signUpWithPasswordResponse = z.object({
    message: z.string(),
    token: z.string(),
})
