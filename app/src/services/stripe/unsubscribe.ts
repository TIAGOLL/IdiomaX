import { api } from "@/lib/api";
import z from "zod";
import { unsubscribeResponse, unsubscribeRequest } from "@idiomax/http-schemas/unsubscribe";

type UnsubscribeResponse = z.infer<typeof unsubscribeResponse>;
type UnsubscribeRequest = z.infer<typeof unsubscribeRequest>;

export async function Unsubscribe(data: UnsubscribeRequest) {
    const response = await api.post(
        '/stripe/unsubscribe',
        data
    );

    return response.data as UnsubscribeResponse;
}
