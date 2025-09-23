import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type { UpdateUserRoleHttpRequest } from '@idiomax/http-schemas/roles/update-user-role';


export async function addUserRole(data: UpdateUserRoleHttpRequest): Promise<{ message: string }> {
    const response = await api.post('/users/roles/add', data);
    return response.data;
}

export async function updateUserRole(data: UpdateUserRoleHttpRequest): Promise<{ message: string }> {
    const companyId = getCurrentCompanyId();

    const response = await api.put('/users/role', {
        ...data,
        companyId
    });

    return response.data;
}

export async function removeUserRole(data: UpdateUserRoleHttpRequest): Promise<{ message: string }> {
    const companyId = getCurrentCompanyId();

    const response = await api.delete('/users/roles/remove', {
        data: {
            ...data,
            companyId
        }
    });

    return response.data;
}