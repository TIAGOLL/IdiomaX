import { api } from '@/lib/api'
import type { CreateLevelRequest, CreateLevelResponse } from '@idiomax/validation-schemas/levels/create-level'

export async function createLevel(data: CreateLevelRequest) {
    const response = await api.post('/levels', data)

    return response.data as CreateLevelResponse
}