import { api } from '@/lib/api'
import type {
    GetClassGradesRequestType,
    GetClassGradesResponseType
} from '@idiomax/validation-schemas/grades'

export async function getClassGrades({ class_id, company_id }: GetClassGradesRequestType) {
    const response = await api.get(`/classes/${class_id}/grades`, {
        params: {
            company_id
        }
    })

    return response.data as GetClassGradesResponseType
}
