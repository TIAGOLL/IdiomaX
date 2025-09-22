import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    DeactivateUserHttpResponse
} from '@idiomax/http-schemas/users/deactivate-user';
import type { UserRole } from '@idiomax/http-schemas/users/get-users';

export type DeactivateUserResponse = DeactivateUserHttpResponse;

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