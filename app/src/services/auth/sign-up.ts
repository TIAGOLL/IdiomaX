import { api } from "@/lib/api";
import type { SignUpRequestType, SignUpResponseType } from "@idiomax/http-schemas/auth/sign-up";

type SignUpRequest = SignUpRequestType;
type SignUpResponse = SignUpResponseType;

export async function signUp(data: SignUpRequest) {
    const response = await api.post('/auth/sign-up', data);
    return response.data as SignUpResponse;
}
