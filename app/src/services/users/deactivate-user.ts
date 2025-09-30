import { api } from '../../lib/api';
import type {
    DeactivateUserRequestType,
    DeactivateUserResponseType
} from '@idiomax/validation-schemas/users/deactivate-user';

export async function deactivateUser(data: DeactivateUserRequestType) {
    const response = await api.patch(`/users/deactivate`, data);
    return response.data as DeactivateUserResponseType;
}