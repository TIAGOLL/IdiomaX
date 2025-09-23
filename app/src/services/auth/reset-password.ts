import { api } from "@/lib/api";
import type { ResetPasswordRequestType, ResetPasswordResponseType } from '@idiomax/http-schemas/auth/reset-password';

export async function resetPassword(data: ResetPasswordRequestType) {
  const response = await api.post('/auth/reset-password', data);
  return response.data as ResetPasswordResponseType;
}
