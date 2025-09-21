import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type { UserRole } from '@idiomax/http-schemas/get-users';

export interface UpdateUserRoleData {
    userId: string;
    role: UserRole;
}

export async function updateUserRole(data: UpdateUserRoleData): Promise<{ message: string }> {
    const companyId = getCurrentCompanyId();

    const response = await api.put('/users/role', {
        ...data,
        companyId
    });

    return response.data;
}