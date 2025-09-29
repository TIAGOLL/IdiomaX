import { api } from "@/lib/api";
import type { ResetPasswordRequestType, ResetPasswordResponseType } from '@idiomax/validation-schemas/auth/reset-password';

export async function resetPassword(data: ResetPasswordRequestType) {
  const response = await api.post('/auth/reset-password-request', data);
  return response.data as ResetPasswordResponseType;
}
