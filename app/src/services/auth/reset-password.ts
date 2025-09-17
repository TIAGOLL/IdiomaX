import { api } from "@/lib/api";
import z from "zod";
import { resetPasswordResponse, resetPasswordRequest } from '@idiomax/http-schemas/reset-password';

export type ResetPasswordResponse = z.infer<typeof resetPasswordResponse>;

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequest>;

export async function resetPassword(data: ResetPasswordRequest) {
  const response = await api.post('/auth/reset-password', data);
  return response.data as ResetPasswordResponse;
}
