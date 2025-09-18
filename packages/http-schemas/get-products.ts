import z from "zod"
import { getPricesResponse } from './get-prices';

// Define o schema de um produto
export const getProductsResponse = z.array(
    z.object({
        id: z.string(),
        active: z.boolean(),
        name: z.string(),
        description: z.string().nullable(),
        image: z.string().nullable(),
        metadata: z.unknown().nullable(),
        prices: z.array(getPricesResponse),
    })
)
