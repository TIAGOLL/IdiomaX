import { api } from '@/lib/api'
import type { CreateCourseApiRequest, CreateCourseApiResponse } from '@idiomax/http-schemas/courses/create-course'

export async function createCourse(data: CreateCourseApiRequest): Promise<CreateCourseApiResponse> {
    const response = await api.post('/courses', data)

    return response.data as CreateCourseApiResponse
}