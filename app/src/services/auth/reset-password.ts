import { api } from "@/lib/api";
import z from "zod";

export const resetPasswordRequest = z.object({
  password: z.string().min(6).max(100),
  token: z.string().min(1),
});

export type ResetPasswordResponse = { message: string };

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequest>;

export async function resetPassword(data: ResetPasswordRequest) {
  const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data);
  return response.data;
}
