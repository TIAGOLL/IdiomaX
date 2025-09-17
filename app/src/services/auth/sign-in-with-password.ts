import { api } from "@/lib/api";
import z from "zod";
import { signInWithPasswordRequest, signInWithPasswordResponse } from "@idiomax/http-schemas/sign-in-with-password";

type SignInWithPasswordRequest = z.infer<typeof signInWithPasswordRequest>;
type SignInWithPasswordResponse = z.infer<typeof signInWithPasswordResponse>;

export async function signInWithPassword(data: SignInWithPasswordRequest) {
    const response = await api.post('/auth/sign-in-with-password', data);
    return response.data as SignInWithPasswordResponse;
}
