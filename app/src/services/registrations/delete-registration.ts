import { api } from '@/lib/api';
import type { DeleteRegistrationRequestType, DeleteRegistrationResponseType } from '@idiomax/validation-schemas/registrations/delete-registration';

export async function deleteRegistration(data: DeleteRegistrationRequestType) {
    const response = await api.delete(`/registrations`, {
        data
    });

    return response.data as DeleteRegistrationResponseType;
}