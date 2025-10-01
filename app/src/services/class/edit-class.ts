import { api } from '@/lib/api';
import type { EditClassRequestType, EditClassResponseType } from '@idiomax/validation-schemas/class/edit-class';

export async function editClass(data: EditClassRequestType) {
    const response = await api.put(`/class`, data);
    return response.data as EditClassResponseType;
}
