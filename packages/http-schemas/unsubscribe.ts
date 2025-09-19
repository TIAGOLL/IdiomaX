import z from "zod";

export const unsubscribeResponse = z.object({
    message: z.string(),
});

export const unsubscribeRequest = z.object({
    subscriptionId: z.string().min(1, { message: 'ID da assinatura é obrigatório.' }),
});