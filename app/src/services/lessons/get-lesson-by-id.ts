import { api } from '@/lib/api';
import type { GetLessonByIdRequestType, GetLessonByIdResponseType } from '@idiomax/validation-schemas/lessons/get-lesson-by-id';

export async function getLessonById(params: GetLessonByIdRequestType) {
    const response = await api.get(`/lesson-by-id`, { params });
    return response.data as GetLessonByIdResponseType;
}