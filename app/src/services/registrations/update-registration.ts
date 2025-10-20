import { api } from '@/lib/api';
import type { UpdateRegistrationRequestType, UpdateRegistrationResponseType } from '@idiomax/validation-schemas/registrations/update-registration';

export async function updateRegistration(data: UpdateRegistrationRequestType) {
    const response = await api.put(`/registrations/${data.id}`, {
        ...data,
        company_id: data.company_id
    });

    return response.data as UpdateRegistrationResponseType;
}