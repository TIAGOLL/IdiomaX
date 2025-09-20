import { z } from "zod";
import { StripePriceSchema, StripeProductSchema } from "./entities";

export const getPricesResponse = StripePriceSchema.safeExtend({
    // Transformação para compatibilidade com API existente
    unit_amount: z.union([z.bigint(), z.string(), z.number()]).transform(val => val?.toString()),
    product: StripeProductSchema.optional().nullable(),
});