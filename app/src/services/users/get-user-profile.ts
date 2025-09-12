import api from "@/lib/api";
import z from "zod";

 const getUserProfileResponse = z.object({
    email: z.email(),
    name: z.string(),
    created_at: z.coerce.date(),
    message: z.string(),
    avatar: z.string().nullable(),
    member_on: z.array(
        z.object({
            id: z.uuid(),
            role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
            company_id: z.uuid(),
            user_id: z.uuid(),
            company: z.object({
                id: z.uuid(),
                email: z.email(),
                name: z.string(),
                created_at: z.coerce.date(),
                phone: z.string(),
                address: z.string(),
                updated_at: z.coerce.date(),
                cnpj: z.string(),
                social_reason: z.string(),
                state_registration: z.string(),
                tax_regime: z.string(),
                owner_id: z.uuid(),
            }),
        })
    ),
});

export type getUserProfileResponse = z.infer<typeof getUserProfileResponse>;

export async function getUserProfile() {
    const response = await api.get<getUserProfileResponse>(`/auth/user-profile`);
    return response.data;
}
