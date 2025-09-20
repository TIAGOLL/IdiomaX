import { z } from "zod";
import { StripeProductSchema, StripePriceSchema } from "./entities";

// Response para obter produtos com seus preços
export const getProductsResponse = z.array(
    StripeProductSchema.safeExtend({
        prices: z.array(StripePriceSchema.safeExtend({
            product: StripeProductSchema.optional().nullable(),
        })),
    })
)
