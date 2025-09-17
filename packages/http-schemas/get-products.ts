import z from "zod"

export const getProductsResponse = z.object({
    url: z.url(),
})

export const getProductsRequest = z.object({
    productId: z.string(),
})