import { api } from '../../lib/api';
import type {
    UpdateUserRequestType,
    UpdateUserResponseType
} from '@idiomax/validation-schemas/users/update-user';


export async function updateUser(data: UpdateUserRequestType) {
    const response = await api.put(`/users/update`, data);
    return response.data as UpdateUserResponseType;
}