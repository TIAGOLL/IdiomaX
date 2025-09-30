import type { AdminResetPasswordRequestType, AdminResetPasswordResponseType } from '@idiomax/validation-schemas/users/admin-reset-password';
import { api } from '../../lib/api';

export async function adminResetPassword(data: AdminResetPasswordRequestType) {
    const response = await api.patch(`/users/admin-reset-password`, data);
    return response.data as AdminResetPasswordResponseType;
}