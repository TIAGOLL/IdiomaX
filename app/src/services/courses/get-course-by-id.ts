import { api } from '@/lib/api'
import type { GetCourseByIdResponse, GetCourseByIdParams } from '@idiomax/http-schemas/courses/get-course-by-id'


export async function getCourseById({ course_id }: GetCourseByIdParams): Promise<GetCourseByIdResponse> {
    const response = await api.get(`/course/${course_id}`)

    return response.data as GetCourseByIdResponse
}