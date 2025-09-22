import { api } from "@/lib/api";
import type { ResetPasswordRequestType, ResetPasswordResponseType } from '@idiomax/http-schemas/auth/reset-password';

export type ResetPasswordResponse = ResetPasswordResponseType;

export type ResetPasswordRequest = ResetPasswordRequestType;

export async function resetPassword(data: ResetPasswordRequest) {
  const response = await api.post('/auth/reset-password', data);
  return response.data as ResetPasswordResponse;
}
