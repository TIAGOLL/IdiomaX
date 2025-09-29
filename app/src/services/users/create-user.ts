import type { CreateUserHttpRequest, CreateUserHttpResponse } from '@idiomax/validation-schemas/users/create-user';
import { api } from '../../lib/api';


export async function createUser(data: CreateUserHttpRequest) {
    const response = await api.post<CreateUserHttpResponse>('/users', {
        ...data, date_of_birth: new Date(data.date_of_birth).toISOString().split('T')[0]
    });
    return response.data;
}
