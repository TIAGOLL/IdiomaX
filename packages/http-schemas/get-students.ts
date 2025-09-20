import z from "zod";

export const getStudentsRequest = z.object({
    companyId: z.string().uuid(),
});

export const createStudentFormSchema = z.object({
    name: z.string()
        .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' })
        .max(256, { message: 'Nome deve ter no máximo 256 caracteres.' }),
    email: z
        .email({ message: 'Email inválido.' })
        .min(3, { message: 'Email deve ter pelo menos 3 caracteres.' }),
    cpf: z.string()
        .min(11, { message: 'CPF deve ter 11 caracteres.' })
        .max(11, { message: 'CPF deve ter 11 caracteres.' }),
    gender: z.enum(['M', 'F'], { message: 'Gênero deve ser Masculino ou Feminino.' }),
});
