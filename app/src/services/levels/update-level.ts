import { api } from '@/lib/api'
import type { UpdateLevelRequest, UpdateLevelResponse } from '@idiomax/validation-schemas/levels/update-level'

export async function updateLevel(data: UpdateLevelRequest) {
    const response = await api.put(`/level`, data)

    return response.data as UpdateLevelResponse
}