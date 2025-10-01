import { api } from '@/lib/api';
import type { GetClassByIdRequestType, GetClassByIdResponseType } from '@idiomax/validation-schemas/class';

export async function getClassById(data: GetClassByIdRequestType) {
    const response = await api.get(`/class-by-id`, {
        params: data
    });
    return response.data as GetClassByIdResponseType;
}
