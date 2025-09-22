import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetUserByEmailHttpResponse
} from '@idiomax/http-schemas/users/get-user-by-email';

export type GetStudentByEmailResponse = GetUserByEmailHttpResponse;

export async function getStudentByEmail(
    email: string
): Promise<GetStudentByEmailResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/users/by-email`, {
        params: {
            companyId,
            email,
            role: 'STUDENT'
        }
    });
    return data;
}