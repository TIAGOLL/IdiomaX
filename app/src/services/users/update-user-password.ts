import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    updateUserPasswordBody,
    updateUserPasswordResponse
} from '@idiomax/http-schemas/update-user-password';
import type { UserRole } from '@idiomax/http-schemas/get-users';
import type { z } from 'zod';

export type UpdateUserPasswordBody = z.infer<typeof updateUserPasswordBody>;
export type UpdateUserPasswordResponse = z.infer<typeof updateUserPasswordResponse>;

export async function updateUserPassword(
    role: UserRole,
    userId: string,
    body: UpdateUserPasswordBody
): Promise<UpdateUserPasswordResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.patch(`/companies/${companyId}/users/${userId}/password`, body, {
        params: {
            role
        }
    });
    return data;
}