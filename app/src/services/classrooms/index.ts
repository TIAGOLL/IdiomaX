import { api } from '@/lib/api'
import { GetClassroomsResponseSchema, GetClassroomsQuerySchema } from '@idiomax/http-schemas/classrooms/get-classrooms'
import { UpdateClassroomApiRequestSchema, type UpdateClassroomResponse, } from '@idiomax/http-schemas/classrooms/update-classroom'
import { z } from 'zod'
import type { CreateClassroomApiRequestSchema, CreateClassroomApiResponseSchema } from '@idiomax/http-schemas/classrooms/create-classroom'
import { type DeleteClassroomApiRequest, type DeleteClassroomApiResponse } from '@idiomax/http-schemas/classrooms/delete-classroom';

type CreateClassroomRequest = z.infer<typeof CreateClassroomApiRequestSchema>
type CreateClassroomResponse = z.infer<typeof CreateClassroomApiResponseSchema>

type GetClassroomsQuery = z.infer<typeof GetClassroomsQuerySchema>
type GetClassroomsResponse = z.infer<typeof GetClassroomsResponseSchema>

type UpdateClassroomRequest = z.infer<typeof UpdateClassroomApiRequestSchema>

// Criar sala de aula
export async function createClassroom(data: CreateClassroomRequest): Promise<CreateClassroomResponse> {
    const response = await api.post('/classroom', data)
    return response.data
}

// Listar salas de aula
export async function getClassrooms(params?: GetClassroomsQuery): Promise<GetClassroomsResponse> {
    const response = await api.get('/classrooms', { params })
    return response.data
}

// Atualizar sala de aula
export async function updateClassroom(data: UpdateClassroomRequest): Promise<UpdateClassroomResponse> {
    const response = await api.put(`/classroom`, data)
    return response.data
}

// Deletar sala de aula
export async function deleteClassroom({ id }: DeleteClassroomApiRequest): Promise<DeleteClassroomApiResponse> {
    const response = await api.delete(`/classroom/${id}`)
    return response.data
}