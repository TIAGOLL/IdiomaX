import { api } from "@/lib/api";
import z from "zod";
import { getProductsResponse } from "@idiomax/http-schemas/get-products";

type getProductsResponse = z.infer<typeof getProductsResponse>;

export async function getProducts() {
    const response = await api.get(
        '/stripe/get-products',
    );

    return response.data as getProductsResponse;
}
