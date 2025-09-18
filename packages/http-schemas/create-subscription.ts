import z from "zod";

export const createSubscriptionRequest = z.object({
    priceId: z.string().min(1, 'O plano é obrigatório!'),
    companyId: z.string().min(1, 'A empresa é obrigatória!'),
})

export const createSubscriptionResponse = z.object({
    message: z.string(),
})