import { api } from '@/lib/api'
import type { DeactivateLevelFormData, DeactivateLevelResponse } from '@idiomax/http-schemas/levels/deactivate-level'

export async function deactivateLevel(id: string, data: DeactivateLevelFormData): Promise<DeactivateLevelResponse> {
    const response = await api.patch(`/levels/${id}/deactivate`, data)

    return response.data as DeactivateLevelResponse
}