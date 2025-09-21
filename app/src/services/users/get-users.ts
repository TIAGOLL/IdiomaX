import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    getUsersQuery,
    getUsersResponse,
    UserRole
} from '@idiomax/http-schemas/get-users';
import type { z } from 'zod';

export type GetUsersQuery = z.infer<typeof getUsersQuery>;
export type GetUsersResponse = z.infer<typeof getUsersResponse>;

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