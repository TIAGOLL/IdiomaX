import { api } from "@/lib/api";
import z from "zod";
import { signUpWithPasswordRequest, signUpWithPasswordResponse } from "@idiomax/http-schemas/sign-up-with-password";

type SignUpWithPasswordRequest = z.infer<typeof signUpWithPasswordRequest>;
type SignUpWithPasswordResponse = z.infer<typeof signUpWithPasswordResponse>;

export async function signUpWithPassword(data: SignUpWithPasswordRequest) {
    const response = await api.post('/auth/sign-up-with-password', data);
    return response.data as SignUpWithPasswordResponse;
}
