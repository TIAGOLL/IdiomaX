import { api } from "@/lib/api";
import type { SignInRequestType, SignInResponseType } from "@idiomax/http-schemas/auth/sign-in";

type SignInRequest = SignInRequestType;
type SignInResponse = SignInResponseType;

export async function signIn(data: SignInRequest) {
    const response = await api.post('/auth/sign-in', data);
    return response.data as SignInResponse;
}
