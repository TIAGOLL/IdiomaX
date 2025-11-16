import { api } from '@/lib/api'
import type {
    GetStudentGradesRequestType,
    GetStudentGradesResponseType
} from '@idiomax/validation-schemas/grades'

export async function getStudentGrades({ company_id }: GetStudentGradesRequestType) {
    const response = await api.get('/students/grades', {
        params: {
            company_id
        }
    })

    return response.data as GetStudentGradesResponseType
}
