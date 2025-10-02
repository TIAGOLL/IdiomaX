import { api } from '@/lib/api'
import type { RemoveUserInClassRequestType, RemoveUserInClassResponseType } from '@idiomax/validation-schemas/class'

export async function removeUserInClass(data: RemoveUserInClassRequestType) {
    const response = await api.delete('/user-in-class', {
        data: data
    })

    return response.data as RemoveUserInClassResponseType
}