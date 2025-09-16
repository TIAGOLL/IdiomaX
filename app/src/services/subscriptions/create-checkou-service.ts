import { api } from "@/lib/api";
import z from "zod";

export const CreateCheckoutSessionRequest = z.object({
    productId: z.string(),
});

type CreateCheckoutSessionResponse = {
    url: string;
};

type CreateCheckoutSessionSchema = z.infer<typeof CreateCheckoutSessionRequest>;

export async function createCheckoutSession(
    data: CreateCheckoutSessionSchema
): Promise<CreateCheckoutSessionResponse> {
    const response = await api.post<CreateCheckoutSessionResponse>(
        '/create-checkout-session',
        data
    );

    return response.data;
}
