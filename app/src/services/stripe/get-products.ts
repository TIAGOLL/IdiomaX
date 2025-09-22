import { api } from "@/lib/api";
import type { GetProductsHttpResponse } from "@idiomax/http-schemas/subscriptions/get-products";

export async function getProducts() {
    const response = await api.get(
        '/stripe/get-products',
    );

    return response.data as GetProductsHttpResponse;
}
