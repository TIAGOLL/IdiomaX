import { api } from '@/lib/api'
import type { UpdateLevelRequest, UpdateLevelResponse } from '@idiomax/http-schemas/levels/update-level'

export async function updateLevel(id: string, data: UpdateLevelRequest): Promise<UpdateLevelResponse> {
    const response = await api.put(`/levels/${id}`, data)

    return response.data as UpdateLevelResponse
}