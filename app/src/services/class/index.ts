import { api } from '@/lib/api'
import type { GetClassResponseType, GetClassRequestType } from '@idiomax/validation-schemas/class'

// Criar sala de aula
export async function getClass(data: GetClassRequestType) {
    const response = await api.get('/class', { params: data })
    console.log(response.data)
    return response.data as GetClassResponseType
}

// // Listar salas de aula
// export async function createClass(data: GetClassRequestType) {
//     const response = await api.get('/class', { params: data })
//     return response.data as GetClassResponseType
// }

// // Atualizar sala de aula
// export async function updateClass(data: UpdateClassRequestType) {
//     const response = await api.put(`/class`, data)
//     return response.data as UpdateClassResponseType
// }

// // Deletar sala de aula
// export async function deleteClass({ id }: DeleteClassRequestType) {
//     const response = await api.delete(`/class/${id}`)
//     return response.data as DeleteClassResponseType
// }