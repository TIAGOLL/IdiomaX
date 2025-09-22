import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    UpdateUserHttpRequest,
    UpdateUserHttpResponse
} from '@idiomax/http-schemas/users/update-user';

export type UpdateStudentBody = UpdateUserHttpRequest;
export type UpdateStudentResponse = UpdateUserHttpResponse;

export async function updateStudent(
    body: UpdateStudentBody
): Promise<UpdateStudentResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.put(`/users/update`, {
        ...body,
        companyId,
        role: 'STUDENT'
    });
    return data;
}