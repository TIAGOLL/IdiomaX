import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import type { GetCompanySubscriptionHttpResponse } from "@idiomax/http-schemas/subscriptions/get-company-subscription";


export async function getCompanySubscription() {
    const companyId = getCurrentCompanyId();

    const response = await api.get(
        `/stripe/get-subscription/${companyId}`,
    );

    return response.data as GetCompanySubscriptionHttpResponse;
}
