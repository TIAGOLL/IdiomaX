import { api } from "@/lib/api";
import type { GetProductsRequestType, GetProductsResponseType } from "@idiomax/validation-schemas/subscriptions/get-products";

export async function getProducts({ active = true }: GetProductsRequestType) {
    const response = await api.get(
        '/stripe/get-products',
        {
            params: {
                active
            }
        }
    );

    return response.data as GetProductsResponseType;
}
