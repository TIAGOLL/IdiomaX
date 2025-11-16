import { api } from '@/lib/api'
import type {
    UpdateGradeRequestType,
    UpdateGradeResponseType
} from '@idiomax/validation-schemas/grades'

export async function updateGrade(data: UpdateGradeRequestType) {
    const response = await api.put(`/grades/${data.submission_id}`, {
        grade: data.grade,
        company_id: data.company_id
    })

    return response.data as UpdateGradeResponseType
}
