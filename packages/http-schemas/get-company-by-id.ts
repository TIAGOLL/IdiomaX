import z from "zod"

export const getCompanyByIdRequest = z.object({
    companyId: z.uuid()
})

export const getCompanyByIdResponse = z.object({
    id: z.string(),
    name: z.string(),
    cnpj: z.string(),
    phone: z.string(),
    email: z.string().optional().nullable(),
    logo_16x16_url: z.string().optional().nullable(),
    logo_512x512_url: z.string().optional().nullable(),
    social_reason: z.string().optional().nullable(),
    state_registration: z.string().optional().nullable(),
    tax_regime: z.string().optional().nullable(),
    created_at: z.date().optional().nullable(),
    updated_at: z.date().optional().nullable(),
    address: z.string(),
    owner_id: z.string()
}).optional()