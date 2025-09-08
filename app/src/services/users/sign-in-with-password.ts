import api from "@/lib/api";
import z from "zod";

export const signInFormSchema = z.object({
    username: z.string().max(45, 'Máximo 45 caracteres').min(1, 'Preencha o usúario').trim(),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').trim(),
})

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export async function signInWithPassword(data: SignInFormSchema) {
    const response = await api.post<{ message: string, token: string }>('/auth/sign-in-with-password', data);
    return response.data;
}
