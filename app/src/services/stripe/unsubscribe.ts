import { api } from "@/lib/api";
import z from "zod";
import { unsubscribeResponse } from "@idiomax/http-schemas/unsubscribe";

type UnsubscribeResponse = z.infer<typeof unsubscribeResponse>;

export async function Unsubscribe() {
    const response = await api.get(
        '/stripe/unsubscribe',
    );

    return response.data as UnsubscribeResponse;
}
