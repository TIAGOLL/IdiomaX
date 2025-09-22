import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetUserByEmailHttpResponse
} from '@idiomax/http-schemas/users/get-user-by-email';
import type { UserRole } from '@idiomax/http-schemas/users/get-users';

export type GetUserByEmailResponse = GetUserByEmailHttpResponse;

export async function getUserByEmail(
    role: UserRole,
    email: string
): Promise<GetUserByEmailResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/users/by-email`, {
        params: {
            companyId,
            role,
            email
        }
    });
    return data;
}