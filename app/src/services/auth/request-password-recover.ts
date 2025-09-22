import { api } from "@/lib/api";
import type { RequestPasswordRecoverRequestType, RequestPasswordRecoverResponseType } from "@idiomax/http-schemas/auth/request-password-recover";

type PasswordRecoverRequest = RequestPasswordRecoverRequestType;

type PasswordRecoverResponse = RequestPasswordRecoverResponseType;

export async function requestPasswordRecover(data: PasswordRecoverRequest) {
    const response = await api.post('/auth/request-password-recover', data);
    return response.data as PasswordRecoverResponse;
}
