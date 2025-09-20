import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    getUserByEmailResponse
} from '@idiomax/http-schemas/get-user-by-email';
import type { UserRole } from '@idiomax/http-schemas/get-users';
import type { z } from 'zod';

export type GetUserByEmailResponse = z.infer<typeof getUserByEmailResponse>;

export async function getUserByEmail(
    role: UserRole,
    email: string
): Promise<GetUserByEmailResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/companies/${companyId}/users/email/${encodeURIComponent(email)}`, {
        params: {
            role
        }
    });
    return data;
}