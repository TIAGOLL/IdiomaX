import { api } from '@/lib/api';
import type { CreateRegistrationRequestType, CreateRegistrationResponseType } from '@idiomax/validation-schemas/registrations/create-registration';

export async function createRegistration(data: CreateRegistrationRequestType) {
    const response = await api.post('/registrations', data);

    return response.data as CreateRegistrationResponseType;
}