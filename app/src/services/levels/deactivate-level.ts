import { api } from '@/lib/api'
import type { DeactivateLevelRequestType, DeactivateLevelResponseType } from '@idiomax/validation-schemas/levels/deactivate-level'

export async function deactivateLevel(data: DeactivateLevelRequestType) {
    const response = await api.patch(`/level/deactivate`, data)

    return response.data as DeactivateLevelResponseType
}