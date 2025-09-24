import { api } from '@/lib/api';

export interface CreateDisciplineRequest {
    name: string;
    level_id: string;
}

export interface UpdateDisciplineRequest {
    id: string;
    name: string;
}

export interface ToggleDisciplineStatusRequest {
    id: string;
    active: boolean;
}

export interface DeleteDisciplineRequest {
    id: string;
}

export async function createDiscipline(data: CreateDisciplineRequest) {
    const response = await api.post('/disciplines', data);
    return response.data;
}

export async function updateDiscipline(data: UpdateDisciplineRequest) {
    const response = await api.put(`/disciplines/${data.id}`, {
        name: data.name,
    });
    return response.data;
}

export async function toggleDisciplineStatus(data: ToggleDisciplineStatusRequest) {
    const response = await api.patch(`/disciplines/${data.id}/toggle-status`, {
        active: data.active,
    });
    return response.data;
}

export async function deleteDiscipline(data: DeleteDisciplineRequest) {
    const response = await api.delete(`/disciplines/${data.id}`);
    return response.data;
}