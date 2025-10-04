import { api } from '@/lib/api';
import type { EditRegistrationRequestType, EditRegistrationResponseType } from '@idiomax/validation-schemas/registrations/edit-registration';

export async function editRegistration(data: EditRegistrationRequestType) {
    const response = await api.put(`/registrations`, data);

    return response.data as EditRegistrationResponseType;
}