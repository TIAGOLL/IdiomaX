import { api } from "@/lib/api";
import z from "zod";
import { createSubscriptionResponse, createSubscriptionRequest } from "@idiomax/http-schemas/create-subscription";

type CreateSubscriptionRequest = z.infer<typeof createSubscriptionRequest>;

type CreateSubscriptionResponse = z.infer<typeof createSubscriptionResponse>;

export async function createSubscription(data: CreateSubscriptionRequest) {
    const response = await api.post(
        '/stripe/create-subscription',
        data
    );

    return response.data as CreateSubscriptionResponse;
}
