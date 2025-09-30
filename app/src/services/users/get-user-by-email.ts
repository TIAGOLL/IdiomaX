import { api } from '../../lib/api';
import type {
    GetUserByEmailRequestType, GetUserByEmailResponseType
} from '@idiomax/validation-schemas/users/get-user-by-email';

export async function getUserByEmail(data: GetUserByEmailRequestType) {
    const response = await api.get(`/users/by-email`, {
        params: {
            data
        }
    });
    return response.data as GetUserByEmailResponseType;
}