import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    UpdateUserPasswordHttpRequest,
    UpdateUserPasswordHttpResponse
} from '@idiomax/http-schemas/users/update-user-password';
import type { UserRole } from '@idiomax/http-schemas/users/get-users';

export type UpdateUserPasswordBody = UpdateUserPasswordHttpRequest;
export type UpdateUserPasswordResponse = UpdateUserPasswordHttpResponse;

export async function updateUserPassword(
    role: UserRole,
    userId: string,
    body: UpdateUserPasswordBody
): Promise<UpdateUserPasswordResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.patch(`/users/update-password`, {
        ...body,
        userId,
        companyId,
        role
    });
    return data;
}