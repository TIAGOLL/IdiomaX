import { api } from '@/lib/api'
import type { CreateCourseApiRequestType, CreateCourseApiResponseType } from '@idiomax/validation-schemas/courses/create-course'

export async function createCourse(data: CreateCourseApiRequestType) {
    const response = await api.post('/courses', data)

    return response.data as CreateCourseApiResponseType
}