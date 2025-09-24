import { api } from '@/lib/api'
import type { GetLevelByIdResponse } from '@idiomax/http-schemas/levels/get-level-by-id'

export async function getLevelById(id: string): Promise<GetLevelByIdResponse> {
    const response = await api.get(`/levels-by-id/${id}`)

    return response.data as GetLevelByIdResponse
}