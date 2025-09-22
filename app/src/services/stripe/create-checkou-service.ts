import { api } from "@/lib/api";
import type { CreateCheckoutSessionHttpRequest, CreateCheckoutSessionHttpResponse } from "@idiomax/http-schemas/subscriptions/create-checkout-session";

type CreateCheckoutSessionResponse = CreateCheckoutSessionHttpResponse;

type CreateCheckoutSessionRequest = CreateCheckoutSessionHttpRequest;

export async function createCheckoutSession(data: CreateCheckoutSessionRequest) {
    const response = await api.post(
        '/stripe/create-checkout-session',
        data
    );

    return response.data as CreateCheckoutSessionResponse;
}
