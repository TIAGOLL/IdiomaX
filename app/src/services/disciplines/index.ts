import { api } from '@/lib/api';
import type { CreateDisciplineRequestType, CreateDisciplineResponseType } from '@idiomax/validation-schemas/disciplines/create-discipline';
import type { AlterDisciplineStatusRequestType, AlterDisciplineStatusResponseType } from '@idiomax/validation-schemas/disciplines/toggle-discipline-status';
import type { DeleteDisciplineRequestType, DeleteDisciplineResponseType } from '@idiomax/validation-schemas/disciplines/delete-discipline';
import type { UpdateDisciplineRequestType, UpdateDisciplineResponseType } from '@idiomax/validation-schemas/disciplines/update-discipline';

export async function createDiscipline(data: CreateDisciplineRequestType) {
    const response = await api.post('/disciplines', data);
    return response.data as CreateDisciplineResponseType;
}

export async function updateDiscipline(data: UpdateDisciplineRequestType) {
    const response = await api.put(`/disciplines`, data);
    return response.data as UpdateDisciplineResponseType;
}

export async function alterDisciplineStatus(data: AlterDisciplineStatusRequestType) {
    const response = await api.patch(`/disciplines`, data);
    return response.data as AlterDisciplineStatusResponseType;
}

export async function deleteDiscipline(data: DeleteDisciplineRequestType) {
    const response = await api.delete(`/disciplines`, { data });
    return response.data as DeleteDisciplineResponseType;
}