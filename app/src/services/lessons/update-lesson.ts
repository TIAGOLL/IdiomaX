import { api } from '@/lib/api';
import type { UpdateLessonRequestType, UpdateLessonResponseType } from '@idiomax/validation-schemas/lessons/update-lesson';

export async function updateLesson(data: UpdateLessonRequestType) {
    const response = await api.put('/lesson', data);
    return response.data as UpdateLessonResponseType;
}