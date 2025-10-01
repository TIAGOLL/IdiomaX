import { api } from '@/lib/api'
import type { DeleteClassRequestType, DeleteClassResponseType } from '@idiomax/validation-schemas/class'

export async function deleteClass(data: DeleteClassRequestType) {
    const response = await api.delete('/class', {
        data: data
    })

    return response.data as DeleteClassResponseType
}