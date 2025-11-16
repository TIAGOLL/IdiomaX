import { api } from '@/lib/api';
import type { DeleteTaskResponseType } from '@idiomax/validation-schemas/tasks/delete-task';

export async function deleteTask(taskId: string): Promise<DeleteTaskResponseType> {
    const response = await api.delete<DeleteTaskResponseType>(`/tasks/${taskId}`);
    return response.data;
}
