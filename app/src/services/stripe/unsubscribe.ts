import { api } from "@/lib/api";
import type { UnsubscribeHttpResponse, UnsubscribeHttpRequest } from "@idiomax/validation-schemas/subscriptions/unsubscribe";

type UnsubscribeResponse = UnsubscribeHttpResponse;
type UnsubscribeRequest = UnsubscribeHttpRequest;

export async function Unsubscribe(data: UnsubscribeRequest) {
    const response = await api.post(
        '/stripe/unsubscribe',
        data
    );

    return response.data as UnsubscribeResponse;
}
