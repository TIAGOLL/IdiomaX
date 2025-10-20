import { api } from '@/lib/api';
import type { GetRegistrationByIdRequestType, GetRegistrationByIdResponseType } from '@idiomax/validation-schemas/registrations';

export async function getRegistrationById(params: GetRegistrationByIdRequestType) {
    const response = await api.get(`/get-registration-by-id`, {
        params
    });

    return response.data as GetRegistrationByIdResponseType;
}