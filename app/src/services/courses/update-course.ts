import { api } from '@/lib/api'
import type { UpdateCourseApiRequest, UpdateCourseApiResponse } from '@idiomax/validation-schemas/courses/update-course'

export async function updateCourse(data: UpdateCourseApiRequest) {
    const response = await api.put(`/course/${data.id}`, data)

    return response.data as UpdateCourseApiResponse
}