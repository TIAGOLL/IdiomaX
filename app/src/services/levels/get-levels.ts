import { api } from '@/lib/api'
import type { GetLevelsRequestType, GetLevelsResponseType } from '@idiomax/validation-schemas/levels/get-levels'

export async function getLevelsByCourse(data: GetLevelsRequestType) {
    const response = await api.get('/levels-by-course', {
        params: data
    })

    return response.data as GetLevelsResponseType
}