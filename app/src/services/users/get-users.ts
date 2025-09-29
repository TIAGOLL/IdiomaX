import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetUsersHttpRequest,
    GetUsersHttpResponse,
    UserRole
} from '@idiomax/validation-schemas/users/get-users';

export async function getUsers(
    role?: UserRole,
    query?: Partial<Omit<GetUsersHttpRequest, 'role'>>
): Promise<GetUsersHttpResponse> {
    const company_id = getCurrentCompanyId();

    const { data } = await api.get(`/users`, {
        params: {
            company_id,
            ...query,
            ...(role && { role })
        }
    });
    return data;
}