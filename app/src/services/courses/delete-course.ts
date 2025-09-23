import { api } from '@/lib/api'
import type { DeleteCourseRequest, DeleteCourseResponse } from '@idiomax/http-schemas/courses/delete-course'

export async function deleteCourse(data: DeleteCourseRequest): Promise<DeleteCourseResponse> {
    const response = await api.delete('/courses/delete', {
        data: data
    })

    return response.data
}