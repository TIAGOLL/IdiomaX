import type { CreateUserHttpRequest, CreateUserHttpResponse } from '@idiomax/http-schemas/users/create-user';
import { api } from '../../lib/api';


export async function createUser(data: CreateUserHttpRequest) {
    const response = await api.post<CreateUserHttpResponse>('/users', data);
    return response.data;
}
