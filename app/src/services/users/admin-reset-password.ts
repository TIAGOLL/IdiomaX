import type { AdminResetPasswordHttpRequest } from '@idiomax/validation-schemas/users/admin-reset-password';
import { api } from '../../lib/api';
import type {
    UpdateUserPasswordHttpResponse
} from '@idiomax/validation-schemas/users/update-user-password';

export async function adminResetPassword(
    data: AdminResetPasswordHttpRequest
): Promise<UpdateUserPasswordHttpResponse> {
    const response = await api.patch(`/users/admin-reset-password`, data);
    return response.data;
}