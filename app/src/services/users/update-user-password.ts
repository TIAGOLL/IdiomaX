import { api } from '../../lib/api';
import type {
    UpdateUserPasswordRequestType,
    UpdateUserPasswordResponseType
} from '@idiomax/validation-schemas/users/update-user-password';

export async function updateUserPassword(data: UpdateUserPasswordRequestType) {
    const response = await api.patch(`/users/update-password`, data);
    return response.data as UpdateUserPasswordResponseType;
}