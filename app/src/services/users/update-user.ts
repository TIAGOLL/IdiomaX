import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    UpdateUserHttpRequest,
    UpdateUserHttpResponse
} from '@idiomax/http-schemas/users/update-user';
import type { UserRole } from '@idiomax/http-schemas/users/get-users';

export type UpdateUserBody = UpdateUserHttpRequest;
export type UpdateUserResponse = UpdateUserHttpResponse;

export async function updateUser(
    role: UserRole,
    body: UpdateUserBody
): Promise<UpdateUserResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.put(`/users/update`, {
        ...body,
        companyId,
        role
    });
    return data;
}