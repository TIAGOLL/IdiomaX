import { api } from "@/lib/api";
import type { GetProductsHttpResponse } from "@idiomax/validation-schemas/subscriptions/get-products";

export async function getProducts() {
    const response = await api.get(
        '/stripe/get-products',
    );

    return response.data as GetProductsHttpResponse;
}
