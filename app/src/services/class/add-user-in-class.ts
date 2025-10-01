import { api } from '@/lib/api';
import type { AddUserInClassRequestType, AddUserInClassResponseType } from '@idiomax/validation-schemas/class/add-user-in-class';

export async function addUserInClass(data: AddUserInClassRequestType) {
    const response = await api.post('/class/add-user', data);
    return response.data as AddUserInClassResponseType;
}
