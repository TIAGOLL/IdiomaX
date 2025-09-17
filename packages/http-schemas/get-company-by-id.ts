import z from "zod"

export const getCompanyByIdRequest = z.object({
    companyId: z.uuid()
})

export const getCompanyByIdResponse = z.object({
    id: z.uuid(),
    name: z.string(),
    cnpj: z.string(),
    phone: z.string(),
    email: z.email(),
    logo_16x16_url: z.url().optional(),
    logo_512x512_url: z.url().optional(),
    social_reason: z.string(),
    state_registration: z.string(),
    tax_regime: z.string(),
    address: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})