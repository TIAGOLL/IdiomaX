import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    DeleteUserHttpResponse
} from '@idiomax/http-schemas/users/delete-user';
import type { UserRole } from '@idiomax/http-schemas/users/get-users';

export type DeleteUserResponse = DeleteUserHttpResponse;

export async function deleteUser(
    role: UserRole,
    userId: string
): Promise<DeleteUserResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.delete(`/users/delete`, {
        data: {
            companyId,
            role,
            userId
        }
    });
    return data;
}