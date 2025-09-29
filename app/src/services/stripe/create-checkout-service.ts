import { api } from "@/lib/api";
import type { CreateCheckoutSessionHttpRequest, CreateCheckoutSessionHttpResponse } from "@idiomax/validation-schemas/subscriptions/create-checkout-session";

export async function createCheckoutSession(data: CreateCheckoutSessionHttpRequest) {
    const response = await api.post(
        '/stripe/create-checkout-session',
        data
    );

    return response.data as CreateCheckoutSessionHttpResponse;
}
