import { api } from '@/lib/api';
import type { CreateTaskRequestType, CreateTaskResponseType } from '@idiomax/validation-schemas/tasks/create-task';

export async function createTask(data: CreateTaskRequestType): Promise<CreateTaskResponseType> {
    const response = await api.post<CreateTaskResponseType>('/tasks', data);
    return response.data;
}
