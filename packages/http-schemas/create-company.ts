import z from "zod";

export const createCompanyRequest = z.object({
    name: z.string().min(3).max(100),
    cnpj: z.string().min(14).max(14),
    phone: z.string().min(11).max(11),
    email: z.email(),
    logo_16x16_url: z.url().optional(),
    logo_512x512_url: z.url().optional(),
    social_reason: z.string().min(3).max(256),
    state_registration: z.string().min(3).max(256),
    tax_regime: z.string().min(3).max(256),
    address: z.string().min(3).max(256),
})

export const createCompanyResponse = z.object({
    message: z.string(),
})