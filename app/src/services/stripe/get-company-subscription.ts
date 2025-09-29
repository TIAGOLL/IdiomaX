import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import type { GetCompanySubscriptionHttpResponse } from "@idiomax/validation-schemas/subscriptions/get-company-subscription";


export async function getCompanySubscription() {
    const companyId = getCurrentCompanyId();
    if (!companyId) return null;

    const response = await api.get(
        `/stripe/get-subscription/${companyId}`,
    );

    return response.data as GetCompanySubscriptionHttpResponse;
}
