import { api } from "@/lib/api";
import z from "zod";
import { resetPasswordRequest, resetPasswordResponse200 } from "../../../../packages/http-schemas/reset-password";

export type ResetPasswordResponse = z.infer<typeof resetPasswordResponse200>;

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequest>;

export async function resetPassword(data: ResetPasswordRequest) {
  const response = await api.post('/auth/reset-password', data);
  return response.data as ResetPasswordResponse;
}
