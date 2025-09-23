import { api } from '../../lib/api';
import type {
    DeleteUserHttpRequest,
    DeleteUserHttpResponse
} from '@idiomax/http-schemas/users/delete-user';

export async function deleteUser(data: DeleteUserHttpRequest): Promise<DeleteUserHttpResponse> {
    const response = await api.delete(`/users/delete`, { data });
    return response.data;
}