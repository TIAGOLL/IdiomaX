import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type { UserRole } from '@idiomax/http-schemas/users/get-users';

export interface UpdateUserRoleData {
    userId: string;
    role: UserRole;
}

export async function addUserRole(data: UpdateUserRoleData): Promise<{ message: string }> {
    const companyId = getCurrentCompanyId();

    const response = await api.post('/users/roles/add', {
        ...data,
        companyId
    });

    return response.data;
}

export async function updateUserRole(data: UpdateUserRoleData): Promise<{ message: string }> {
    const companyId = getCurrentCompanyId();

    const response = await api.put('/users/role', {
        ...data,
        companyId
    });

    return response.data;
}

export async function removeUserRole(data: UpdateUserRoleData): Promise<{ message: string }> {
    const companyId = getCurrentCompanyId();

    const response = await api.delete('/users/roles/remove', {
        data: {
            ...data,
            companyId
        }
    });

    return response.data;
}