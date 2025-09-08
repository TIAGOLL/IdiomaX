import api from "@/lib/api";
import z from "zod";

export const requestPasswordRecoverSchema = z.object({
    email: z.email({ error: "Email inválido" }),
});

export type RequestPasswordRecoverSchema = z.infer<typeof requestPasswordRecoverSchema>;

export async function requestPasswordRecover(data: RequestPasswordRecoverSchema) {
    const response = await api.post('/auth/request-password-recover', data);
    return response.data;
}
