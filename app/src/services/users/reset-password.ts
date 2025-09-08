import api from "@/lib/api";
import z from "zod";

export const resetPasswordSchema = z.object({
  email: z.email(),
});

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export async function resetPassword(data: ResetPasswordSchema) {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
}
