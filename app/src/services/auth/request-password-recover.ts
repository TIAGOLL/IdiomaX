import { api } from "@/lib/api";
import type { RequestPasswordRecoverRequestType, RequestPasswordRecoverResponseType } from "@idiomax/validation-schemas/auth/request-password-recover";

export async function requestPasswordRecover(data: RequestPasswordRecoverRequestType) {
    const response = await api.post('/auth/request-password-recover', data);
    return response.data as RequestPasswordRecoverResponseType;
}
