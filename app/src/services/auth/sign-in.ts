import { api } from "@/lib/api";
import type { SignInRequestType, SignInResponseType } from "@idiomax/http-schemas/auth/sign-in";

export async function signIn(data: SignInRequestType) {
    const response = await api.post('/auth/sign-in', data);
    return response.data as SignInResponseType;
}
