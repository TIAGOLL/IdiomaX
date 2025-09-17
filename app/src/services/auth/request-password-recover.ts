import { api } from "@/lib/api";
import { passwordRecoverRequest, type passwordRecoverResponse201 } from './../../../../packages/http-schemas/request-password-recover';
import z from "zod";

type PasswordRecoverRequest = z.infer<typeof passwordRecoverRequest>;

type PasswordRecoverResponse = z.infer<typeof passwordRecoverResponse201>;

export async function requestPasswordRecover(data: PasswordRecoverRequest) {
    const response = await api.post('/auth/request-password-recover', data);
    return response.data as PasswordRecoverResponse;
}
