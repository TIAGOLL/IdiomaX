import { api } from '@/lib/api';
import type { GetTasksRequestType, GetTasksResponseType } from '@idiomax/validation-schemas/tasks/get-tasks';

export async function getTasks(params: GetTasksRequestType): Promise<GetTasksResponseType> {
    const response = await api.get<GetTasksResponseType>('/tasks', {
        params,
    });
    return response.data;
}
