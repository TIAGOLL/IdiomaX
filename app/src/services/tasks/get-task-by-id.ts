import { api } from '@/lib/api';
import type { GetTaskByIdResponseType } from '@idiomax/validation-schemas/tasks/get-task-by-id';

export async function getTaskById(taskId: string): Promise<GetTaskByIdResponseType> {
    const response = await api.get<GetTaskByIdResponseType>(`/tasks/${taskId}`);
    return response.data;
}
