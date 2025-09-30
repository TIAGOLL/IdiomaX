import { api } from "@/lib/api";
import type { CreateSubscriptionResponseType, CreateSubscriptionRequestType } from "@idiomax/validation-schemas/subscriptions/create-subscription";

export async function createSubscription(data: CreateSubscriptionRequestType) {
    const response = await api.post(
        '/stripe/create-subscription', data
    );

    return response.data as CreateSubscriptionResponseType;
}
