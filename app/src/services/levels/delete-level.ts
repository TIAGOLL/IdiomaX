import { api } from '@/lib/api'
import type { DeleteLevelRequest, DeleteLevelResponse } from '@idiomax/validation-schemas/levels/delete-level'

export async function deleteLevel(data: DeleteLevelRequest) {
    const response = await api.delete(`/level`, {
        data: data
    })

    return response.data as DeleteLevelResponse
}