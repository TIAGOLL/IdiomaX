import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    UpdateUserPasswordHttpResponse
} from '@idiomax/http-schemas/users/update-user-password';
import type { UserRole } from '@idiomax/http-schemas/users/get-users';

export async function adminResetPassword(
    role: UserRole,
    userId: string,
    newPassword: string
): Promise<UpdateUserPasswordHttpResponse> {
    const companyId = getCurrentCompanyId();
    const { data } = await api.patch(`/users/admin-reset-password`, {
        companyId,
        role,
        userId,
        newPassword
    });
    return data;
}