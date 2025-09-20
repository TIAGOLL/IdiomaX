import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    deleteUserResponse
} from '@idiomax/http-schemas/delete-user';
import type { UserRole } from '@idiomax/http-schemas/get-users';
import type { z } from 'zod';

export type DeleteUserResponse = z.infer<typeof deleteUserResponse>;

export async function deleteUser(
    role: UserRole,
    userId: string
): Promise<DeleteUserResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.delete(`/companies/${companyId}/users/${userId}`, {
        params: {
            role
        }
    });
    return data;
}