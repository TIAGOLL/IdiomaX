import z from "zod"

export const createCheckoutSessionRequest = z.object({
    productId: z.string(),
    companyId: z.string(),
})

export const createCheckoutSessionResponse = z.object({
    url: z.url(),
})