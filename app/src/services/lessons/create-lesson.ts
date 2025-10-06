import { api } from '@/lib/api';
import type { CreateLessonRequestType, CreateLessonResponseType } from '@idiomax/validation-schemas/lessons/create-lesson';

export async function createLesson(data: CreateLessonRequestType) {
    const response = await api.post('/lesson', data);
    return response.data as CreateLessonResponseType;
}