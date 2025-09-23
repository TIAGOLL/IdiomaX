import { api } from '@/lib/api'
import type { DeactivateCourseRequest, DeactivateCourseResponse } from '@idiomax/http-schemas/courses/deactivate-course'

export async function deactivateCourse(data: DeactivateCourseRequest): Promise<DeactivateCourseResponse> {
    const response = await api.patch('/courses/deactivate', data)

    return response.data
}