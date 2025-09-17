import { api } from "@/lib/api";
import z from "zod";
import { createCheckoutSessionRequest, createCheckoutSessionResponse } from "@idiomax/http-schemas/create-checkout-session";

type CreateCheckoutSessionResponse = z.infer<typeof createCheckoutSessionResponse>;
type CreateCheckoutSessionRequest = z.infer<typeof createCheckoutSessionRequest>;

export async function createCheckoutSession(data: CreateCheckoutSessionRequest) {
    const response = await api.post(
        '/create-checkout-session',
        data
    );

    return response.data as CreateCheckoutSessionResponse;
}
