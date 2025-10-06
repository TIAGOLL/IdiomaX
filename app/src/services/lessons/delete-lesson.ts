import { api } from '@/lib/api';
import type { DeleteLessonRequestType, DeleteLessonResponseType } from '@idiomax/validation-schemas/lessons/delete-lesson';

export async function deleteLesson(data: DeleteLessonRequestType) {
    const response = await api.delete('/lesson', { data });
    return response.data as DeleteLessonResponseType;
}