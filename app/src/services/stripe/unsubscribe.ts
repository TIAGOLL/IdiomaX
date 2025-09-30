import { api } from "@/lib/api";
import type { UnsubscribeRequestType, UnsubscribeResponseType } from "@idiomax/validation-schemas/subscriptions/unsubscribe";

export async function unsubscribe(data: UnsubscribeRequestType) {
    const response = await api.post(
        '/stripe/unsubscribe',
        data
    );

    return response.data as UnsubscribeResponseType;
}
