import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    updateUserBody,
    updateUserResponse
} from '@idiomax/http-schemas/update-user';
import type { UserRole } from '@idiomax/http-schemas/get-users';
import type { z } from 'zod';

export type UpdateUserBody = z.infer<typeof updateUserBody>;
export type UpdateUserResponse = z.infer<typeof updateUserResponse>;

export async function updateUser(
    role: UserRole,
    body: UpdateUserBody
): Promise<UpdateUserResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.put(`/companies/${companyId}/users/${body.id}`, body, {
        params: {
            role
        }
    });
    return data;
}