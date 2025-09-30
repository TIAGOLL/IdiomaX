import { api } from '../../lib/api';
import type {
    DeleteUserRequestType,
    DeleteUserResponseType
} from '@idiomax/validation-schemas/users/delete-user';

export async function deleteUser(data: DeleteUserRequestType) {
    const response = await api.delete(`/users/delete`, { data });
    return response.data as DeleteUserResponseType;
}