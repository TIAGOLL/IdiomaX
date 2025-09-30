import { api } from '../../lib/api';
import type { GetUserByIdRequestType, GetUserByIdResponseType } from '@idiomax/validation-schemas/users/get-user-by-id';


export async function getUserById(data: GetUserByIdRequestType) {
    const response = await api.get(`/users/by-id`, {
        params: data
    });
    return response.data as GetUserByIdResponseType;
}
