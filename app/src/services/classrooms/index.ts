import { api } from '@/lib/api'
import { type CreateClassroomRequestType, type CreateClassroomResponseType } from '@idiomax/validation-schemas/classrooms/create-classroom';
import type { GetClassroomsRequestType, GetClassroomsResponseType } from '@idiomax/validation-schemas/classrooms/get-classrooms';
import type { UpdateClassroomRequestType, UpdateClassroomResponseType } from '@idiomax/validation-schemas/classrooms/update-classroom';
import type { DeleteClassroomRequestType, DeleteClassroomResponseType } from '@idiomax/validation-schemas/classrooms/delete-classroom';

// Criar sala de aula
export async function createClassroom(data: CreateClassroomRequestType) {
    const response = await api.post('/classroom', data)
    return response.data as CreateClassroomResponseType
}

// Listar salas de aula
export async function getClassrooms(data: GetClassroomsRequestType) {
    const response = await api.get('/classrooms', { params: data })
    return response.data as GetClassroomsResponseType
}

// Atualizar sala de aula
export async function updateClassroom(data: UpdateClassroomRequestType) {
    const response = await api.put(`/classroom`, data)
    return response.data as UpdateClassroomResponseType
}

// Deletar sala de aula
export async function deleteClassroom({ id }: DeleteClassroomRequestType) {
    const response = await api.delete(`/classroom/${id}`)
    return response.data as DeleteClassroomResponseType
}