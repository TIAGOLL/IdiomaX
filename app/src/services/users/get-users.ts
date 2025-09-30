import { api } from '../../lib/api';
import type {
    GetUsersRequestType,
    GetUsersResponseType
} from '@idiomax/validation-schemas/users/get-users';

export async function getUsers({ active = true, ...data }: GetUsersRequestType) {
    const response = await api.get(`/users`, {
        params: {
            ...data,
            active
        }
    });
    return response.data as GetUsersResponseType;
}