import { api } from "@/lib/api";

type SubscriptionByEmailResponse = {
    id: string;
    email: string;
    status: string;
    plan: {
        id: string;
        name: string;
        price: number;
    };
};

type SubscriptionByEmailRequest = {
    email: string;
};

export async function subscriptionByEmail({ email }: SubscriptionByEmailRequest) {
    const response = await api.post(`/stripe/subscription`, { email });
    return response.data as SubscriptionByEmailResponse;
}
