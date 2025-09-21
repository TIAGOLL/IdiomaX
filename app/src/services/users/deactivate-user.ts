import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    deactivateUserResponse
} from '@idiomax/http-schemas/deactivate-user';
import type { UserRole } from '@idiomax/http-schemas/get-users';
import type { z } from 'zod';

export type DeactivateUserResponse = z.infer<typeof deactivateUserResponse>;

export async function deactivateUser(
    role: UserRole,
    userId: string,
    active: boolean
): Promise<DeactivateUserResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.patch(`/users/deactivate`, {
        companyId,
        role,
        userId,
        active
    });
    return data;
}