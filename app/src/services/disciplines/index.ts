import { api } from '@/lib/api';
import type { CreateDisciplineRequest, CreateDisciplineResponse } from '@idiomax/http-schemas/disciplines/create-discipline';
import type { UpdateDisciplineRequest, UpdateDisciplineResponse } from '@idiomax/http-schemas/disciplines/update-discipline';
import type { ToggleDisciplineStatusRequest, ToggleDisciplineStatusResponse } from '@idiomax/http-schemas/disciplines/toggle-discipline-status';
import type { DeleteDisciplineResponse } from '@idiomax/http-schemas/disciplines/delete-discipline';

export async function createDiscipline(data: CreateDisciplineRequest): Promise<CreateDisciplineResponse> {
    const response = await api.post('/disciplines', data);
    return response.data as CreateDisciplineResponse;
}

export async function updateDiscipline(data: UpdateDisciplineRequest): Promise<UpdateDisciplineResponse> {
    const response = await api.put(`/disciplines/${data.id}`, data);
    return response.data as UpdateDisciplineResponse;
}

export async function toggleDisciplineStatus(id: string, data: ToggleDisciplineStatusRequest): Promise<ToggleDisciplineStatusResponse> {
    const response = await api.patch(`/disciplines/${id}/toggle-status`, data);
    return response.data as ToggleDisciplineStatusResponse;
}

export async function deleteDiscipline(id: string): Promise<DeleteDisciplineResponse> {
    const response = await api.delete(`/disciplines/${id}`);
    return response.data as DeleteDisciplineResponse;
}