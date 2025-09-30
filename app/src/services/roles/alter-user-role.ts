import { api } from '../../lib/api';
import type { AlterUserRoleResponseType, AlterUserRoleRequestType } from '@idiomax/validation-schemas/roles/alter-user-role';

export async function alterUserRole(data: AlterUserRoleRequestType) {
    const response = await api.put('/users/role', {
        ...data,
    });

    return response.data as AlterUserRoleResponseType;
}