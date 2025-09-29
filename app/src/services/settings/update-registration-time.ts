import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    UpdateRegistrationTimeHttpRequest,
    UpdateRegistrationTimeHttpResponse
} from '@idiomax/validation-schemas/settings/update-registration-time';

export type UpdateRegistrationTimeBody = Omit<UpdateRegistrationTimeHttpRequest, 'company_id'>;
export type UpdateRegistrationTimeResponse = UpdateRegistrationTimeHttpResponse;

export async function updateRegistrationTime(
    body: UpdateRegistrationTimeBody
): Promise<UpdateRegistrationTimeResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.put('/settings/update-registration-time', {
        ...body,
        company_id: companyId,
    });
    return data;
}