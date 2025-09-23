import type { AdminResetPasswordHttpRequest } from '@idiomax/http-schemas/users/admin-reset-password';
import { api } from '../../lib/api';
import type {
    UpdateUserPasswordHttpResponse
} from '@idiomax/http-schemas/users/update-user-password';

export async function adminResetPassword(
    data: AdminResetPasswordHttpRequest
): Promise<UpdateUserPasswordHttpResponse> {
    const response = await api.patch(`/users/admin-reset-password`, data);
    return response.data;
}