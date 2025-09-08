import api from "@/lib/api";
import z from "zod";

export const signUpFormSchema = z.object({
    name: z.string().min(3).max(256),
    email: z.email().min(3).max(256),
    username: z.string().min(3).max(100),
    cpf: z.string().min(11).max(11),
    phone: z.string().min(10).max(11),
    gender: z.string().min(1).max(1),
    date_of_birth: z.string(),
    address: z.string().min(1).max(255),
    password: z.string().min(6),
    avatar_url: z.url().max(256).optional(),
    companies_id: z.string().min(1).max(256),
    roles_id: z.string().min(1).max(256),
})

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export async function signUpWithPassword(data: SignUpFormSchema) {
    const response = await api.post('/auth/sign-up-with-password', data);
    return response.data;
}
