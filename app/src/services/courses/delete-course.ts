import { api } from '@/lib/api'
import type { DeleteCourseRequest, DeleteCourseResponse } from '@idiomax/validation-schemas/courses/delete-course'

export async function deleteCourse(data: DeleteCourseRequest) {
    const response = await api.delete('/courses/delete', {
        data: data
    })

    return response.data as DeleteCourseResponse
}