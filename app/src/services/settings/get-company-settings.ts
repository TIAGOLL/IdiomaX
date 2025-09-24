import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetCompanySettingsHttpResponse
} from '@idiomax/http-schemas/settings/get-company-settings';

export type GetCompanySettingsResponse = GetCompanySettingsHttpResponse;

export async function GetCompanySettings(): Promise<GetCompanySettingsResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/settings/company/${companyId}`);
    return data;
}