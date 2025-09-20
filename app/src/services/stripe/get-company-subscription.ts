import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import z from "zod";
import { getCompanySubscriptionResponse } from "@idiomax/http-schemas/get-company-subscription";

type GetCompanySubscriptionResponse = z.infer<typeof getCompanySubscriptionResponse>;

export async function getCompanySubscription() {
    const companyId = getCurrentCompanyId();

    const response = await api.get(
        `/stripe/get-subscription/${companyId}`,
    );

    return response.data as GetCompanySubscriptionResponse;
}
