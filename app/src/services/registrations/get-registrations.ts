import { api } from '@/lib/api';
import type { GetRegistrationsRequestType, GetRegistrationsResponseType } from '@idiomax/validation-schemas/registrations/get-registrations';

export async function getRegistrations(params: GetRegistrationsRequestType) {
    const response = await api.get('/registrations', {
        params
    });

    return response.data as GetRegistrationsResponseType;
}