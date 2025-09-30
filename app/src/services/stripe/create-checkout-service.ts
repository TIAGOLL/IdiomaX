import { api } from "@/lib/api";
import type { CreateCheckoutSessionRequestType, CreateCheckoutSessionResponseType } from "@idiomax/validation-schemas/subscriptions/create-checkout-session";

export async function createCheckoutSession(data: CreateCheckoutSessionRequestType) {
    const response = await api.post(
        '/stripe/create-checkout-session',
        data
    );

    return response.data as CreateCheckoutSessionResponseType;
}
