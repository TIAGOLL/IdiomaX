import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    updateUserBody,
    updateUserResponse
} from '@idiomax/http-schemas/update-user';
import type { z } from 'zod';

export type UpdateStudentBody = z.infer<typeof updateUserBody>;
export type UpdateStudentResponse = z.infer<typeof updateUserResponse>;

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