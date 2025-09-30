import type { UpdateRegistrationTimeRequestType, UpdateRegistrationTimeResponseType } from '@idiomax/validation-schemas/settings/update-registration-time';
import { api } from '../../lib/api';

export async function updateRegistrationTime(data: UpdateRegistrationTimeRequestType) {
    const response = await api.put('/settings/update-registration-time', data);
    return response.data as UpdateRegistrationTimeResponseType;
}