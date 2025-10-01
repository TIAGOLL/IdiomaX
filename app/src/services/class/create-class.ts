import { api } from '@/lib/api';
import type { CreateClassRequestType, CreateClassResponseType } from '@idiomax/validation-schemas/class/create-class';

export async function createClass(data: CreateClassRequestType) {
    const response = await api.post('/class', data);
    return response.data as CreateClassResponseType;
}
