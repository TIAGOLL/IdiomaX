import { api } from '@/lib/api'
import type { SubmitTaskRequestType, SubmitTaskResponseType } from '@idiomax/validation-schemas/grades'

export async function submitTask(data: SubmitTaskRequestType) {
    const response = await api.post<SubmitTaskResponseType>('/tasks/submit', data)
    return response.data
}
