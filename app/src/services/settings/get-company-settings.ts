import { api } from '../../lib/api';
import type { GetCompanySettingsRequestType, GetCompanySettingsResponseType } from '@idiomax/validation-schemas/settings/get-company-settings';

export async function GetCompanySettings({ company_id }: GetCompanySettingsRequestType): Promise<GetCompanySettingsResponseType> {
    const response = await api.get(`/settings/company`, {
        params: { company_id },
    });
    return response.data as GetCompanySettingsResponseType;
}