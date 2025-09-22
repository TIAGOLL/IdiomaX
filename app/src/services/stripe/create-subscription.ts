import { api } from "@/lib/api";
import type { CreateSubscriptionHttpRequest, CreateSubscriptionHttpResponse } from "@idiomax/http-schemas/subscriptions/create-subscription";
import { getCurrentCompanyId } from "@/lib/company-utils";

interface CreateSubscriptionRequest {
    priceId: string;
    companyId?: string;
    userId?: string;
}

export async function createSubscription(data: CreateSubscriptionRequest) {
    const requestData: CreateSubscriptionHttpRequest = {
        price_id: data.priceId,
        company_id: data.companyId || getCurrentCompanyId() || '',
        user_id: data.userId || '', // Será obtido do token no backend
    };

    const response = await api.post(
        '/stripe/create-subscription',
        requestData
    );

    return response.data as CreateSubscriptionHttpResponse;
}
