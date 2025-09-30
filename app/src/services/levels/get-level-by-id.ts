import { api } from '@/lib/api'
import type { GetLevelByIdRequestType, GetLevelByIdResponseType } from '@idiomax/validation-schemas/levels/get-level-by-id'

export async function getLevelById(data: GetLevelByIdRequestType) {
    const response = await api.get(`/levels-by-id`, { params: data })

    return response.data as GetLevelByIdResponseType
}