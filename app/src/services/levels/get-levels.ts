import { api } from '@/lib/api'
import type { GetLevelsRequest, GetLevelsResponse } from '@idiomax/http-schemas/levels/get-levels'

export async function getLevels(params: GetLevelsRequest): Promise<GetLevelsResponse> {
    const response = await api.get('/levels', { params })

    return response.data as GetLevelsResponse
}