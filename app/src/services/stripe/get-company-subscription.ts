import { api } from "@/lib/api";
import type { GetCompanySubscriptionRequestType, GetCompanySubscriptionResponseType } from "@idiomax/validation-schemas/subscriptions/get-company-subscription";


export async function getCompanySubscription({ company_id }: GetCompanySubscriptionRequestType) {
    const response = await api.get(
        `/stripe/get-subscription`, {
        params: {
            company_id: company_id
        }
    }
    );

    return response.data as GetCompanySubscriptionResponseType;
}
