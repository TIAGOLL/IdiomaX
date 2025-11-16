import { api } from '@/lib/api';
import type { UpdateTaskRequestType, UpdateTaskResponseType } from '@idiomax/validation-schemas/tasks/update-task';

export async function updateTask(taskId: string, data: UpdateTaskRequestType): Promise<UpdateTaskResponseType> {
    const response = await api.put<UpdateTaskResponseType>(`/tasks/${taskId}`, data);
    return response.data;
}
