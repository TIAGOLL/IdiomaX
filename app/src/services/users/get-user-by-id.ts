import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    UserWithRole
} from '@idiomax/validation-schemas/users/get-users';

export async function getUserById(userId: string): Promise<UserWithRole> {
    const company_id = getCurrentCompanyId();

    const { data } = await api.get(`/users/by-id`, {
        params: {
            user_id: userId,
            company_id
        }
    });
    return data;
}
