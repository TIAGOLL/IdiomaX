import { api } from '@/lib/api'
import type { DeleteLevelResponse } from '@idiomax/http-schemas/levels/delete-level'

export async function deleteLevel(id: string): Promise<DeleteLevelResponse> {
    const response = await api.delete(`/levels/${id}/delete`)

    return response.data as DeleteLevelResponse
}