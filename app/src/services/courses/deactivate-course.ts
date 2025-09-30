import { api } from '@/lib/api'
import type { DeactivateCourseRequestType, DeactivateCourseResponseType } from '@idiomax/validation-schemas/courses/deactivate-course'

export async function deactivateCourse(data: DeactivateCourseRequestType) {
    const response = await api.patch('/courses/deactivate', data)

    return response.data as DeactivateCourseResponseType
}