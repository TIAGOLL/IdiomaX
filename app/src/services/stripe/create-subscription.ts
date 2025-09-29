import { api } from "@/lib/api";
import type { CreateSubscriptionHttpResponse } from "@idiomax/validation-schemas/subscriptions/create-subscription";
import { getCurrentCompanyId } from "@/lib/company-utils";

interface CreateSubscriptionRequest {
    priceId: string;
    companyId?: string;
    userId?: string;
}

export async function createSubscription(data: CreateSubscriptionRequest) {
    const response = await api.post(
        '/stripe/create-subscription',
        {
            company_id: getCurrentCompanyId(),
            price_id: data.priceId,
        }
    );

    return response.data as CreateSubscriptionHttpResponse;
}
