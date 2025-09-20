import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    getUserByEmailResponse
} from '@idiomax/http-schemas/get-user-by-email';
import type { z } from 'zod';

export type GetStudentByEmailResponse = z.infer<typeof getUserByEmailResponse>;

export async function getStudentByEmail(
    email: string
): Promise<GetStudentByEmailResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/companies/${companyId}/users/email/${encodeURIComponent(email)}`, {
        params: {
            role: 'STUDENT'
        }
    });
    return data;
}