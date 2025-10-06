import { api } from '@/lib/api';
import type { GetLessonsRequestType, GetLessonsResponseType } from '@idiomax/validation-schemas/lessons/get-lessons';

export async function getLessons(data: GetLessonsRequestType) {
    const response = await api.get('/lessons', { params: data });
    return response.data as GetLessonsResponseType;
}