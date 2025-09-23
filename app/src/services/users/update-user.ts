import { api } from '../../lib/api';
import type {
    UpdateUserHttpRequest,
    UpdateUserHttpResponse
} from '@idiomax/http-schemas/users/update-user';


export async function updateUser(data: UpdateUserHttpRequest): Promise<UpdateUserHttpResponse> {
    const response = await api.put(`/users/update`, data);
    return response.data;
}