import { api } from '../../lib/api';
import type {
    DeactivateUserHttpRequest,
    DeactivateUserHttpResponse
} from '@idiomax/validation-schemas/users/deactivate-user';

export async function deactivateUser(data: DeactivateUserHttpRequest): Promise<DeactivateUserHttpResponse> {
    const response = await api.patch(`/users/deactivate`, data);
    return response.data;
}