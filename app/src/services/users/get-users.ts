import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetUsersHttpRequest,
    GetUsersHttpResponse,
    UserRole
} from '@idiomax/http-schemas/users/get-users';

export type GetUsersQuery = GetUsersHttpRequest;
export type GetUsersResponse = GetUsersHttpResponse;

export async function getUsers(
    role?: UserRole,
    query?: Partial<Omit<GetUsersQuery, 'role'>>
): Promise<GetUsersResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/users`, {
        params: {
            companyId,
            ...query,
            ...(role && { role })
        }
    });
    return data;
}