import z from "zod";

export const unsubscribeResponse = z.object({
    message: z.string(),
});