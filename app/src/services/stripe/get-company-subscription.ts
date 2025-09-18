import { api } from "@/lib/api";
import z from "zod";
import { getCompanySubscriptionParams, getCompanySubscriptionResponse } from "@idiomax/http-schemas/get-company-subscription";

type getCompanySubscriptionResponse = z.infer<typeof getCompanySubscriptionResponse>;

type getCompanySubscriptionParams = z.infer<typeof getCompanySubscriptionParams>;

export async function getCompanySubscription({ companyId }: getCompanySubscriptionParams) {
    const response = await api.get(
        `/stripe/get-subscription/${companyId}`,
    );

    return response.data as getCompanySubscriptionResponse;
}
