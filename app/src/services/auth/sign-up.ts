import { api } from "@/lib/api";
import type { SignUpRequestType, SignUpResponseType } from "@idiomax/validation-schemas/auth/sign-up";

export async function signUp(data: SignUpRequestType) {
    const response = await api.post('/auth/sign-up', data);
    return response.data as SignUpResponseType;
}
