import z from "zod";

export const putCompanyRequest = z.object({
    id: z.string(),
    name: z.string().min(3, { message: 'Nome da empresa deve ter pelo menos 3 caracteres.' }).max(256),
    cnpj: z.string().min(14, { message: 'CNPJ deve ter 14 caracteres.' }).max(14),
    address: z.string().min(1, { message: 'Endereço da empresa é obrigatório.' }).max(256),
    phone: z.string().min(10, { message: 'Telefone da empresa deve ter pelo menos 10 caracteres.' }).max(15),
    email: z.email({ message: 'E-mail inválido.' }).max(256).optional().nullable(),
    logo_16x16_url: z.url({ message: 'URL inválida.' }).max(512).optional().nullable(),
    logo_512x512_url: z.url({ message: 'URL inválida.' }).max(512).optional().nullable(),
    social_reason: z.string({ message: 'Razão social inválida.' }).max(256).optional().nullable(),
    state_registration: z.string({ message: 'Inscrição estadual inválida.' }).max(256).optional().nullable(),
    tax_regime: z.string({ message: 'Regime tributário inválido.' }).max(256).optional().nullable(),
})

export const putCompanyResponse = z.object({
    message: z.string(),
});