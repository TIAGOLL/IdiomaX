import api from "@/lib/api";
import z from "zod";

export const signInFormRequest = z.object({
    username: z.string().max(45, 'Máximo 45 caracteres').min(1, 'Preencha o usúario').trim(),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').trim(),
})

type SignInFormRequest = z.infer<typeof signInFormRequest>;

export async function signInWithPassword(data: SignInFormRequest) {
    const response = await api.post('/auth/sign-in-with-password', data);
    return response.data as { message: string, token: string };
}
