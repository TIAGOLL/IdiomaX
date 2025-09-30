import { api } from '@/lib/api'
import type { GetCourseByIdRequestType, GetCourseByIdResponseType } from '@idiomax/validation-schemas/courses/get-course-by-id'


export async function getCourseById({ course_id }: GetCourseByIdRequestType) {
    const response = await api.get(`/course/${course_id}`)

    return response.data as GetCourseByIdResponseType
}