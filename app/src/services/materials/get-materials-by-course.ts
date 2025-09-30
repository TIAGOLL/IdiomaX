import { api } from '@/lib/api'
import { type GetMaterialsByLevelRequestType, type GetMaterialsByLevelResponseType } from '@idiomax/validation-schemas/materials/get-materials-by-level';

export async function getMaterialsByCourse(data: GetMaterialsByLevelRequestType) {
    const response = await api.get(`/materials`, {
        params: {
            data
        }
    })

    return response.data as GetMaterialsByLevelResponseType
}