import z from "zod";

export const createCompanyRequest = z.object({
    name: z.string().min(3, { message: 'Nome da empresa deve ter pelo menos 3 caracteres.' }).max(256),
    cnpj: z.string().min(14, { message: 'CNPJ deve ter 14 caracteres.' }).max(14),
    address: z.string().min(1, { message: 'Endereço da empresa é obrigatório.' }).max(256),
    phone: z.string().min(10, { message: 'Telefone da empresa deve ter pelo menos 10 caracteres.' }).max(15),
    email: z.email({ message: 'E-mail inválido.' }).max(256).optional().nullable(),
    logo_16x16_url: z.url().optional(),
    logo_512x512_url: z.url().optional(),
    social_reason: z.string().max(256).optional(),
    state_registration: z.string().max(256).optional(),
    tax_regime: z.string().max(256).optional(),
})

export const createCompanyResponse = z.object({
    message: z.string(),
    companyId: z.string(),
})