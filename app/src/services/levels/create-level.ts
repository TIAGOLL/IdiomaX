import { api } from '@/lib/api'
import type { CreateLevelRequest, CreateLevelResponse } from '@idiomax/http-schemas/levels/create-level'

export async function createLevel(data: CreateLevelRequest): Promise<CreateLevelResponse> {
    const response = await api.post('/levels', data)

    return response.data as CreateLevelResponse
}