import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import type { GetCompanyByIdHttpResponse } from "@idiomax/http-schemas/companies/get-company-by-id";

type GetCompanyByIdResponse = GetCompanyByIdHttpResponse;

export async function getCompanyById() {
    const companyId = getCurrentCompanyId();

    if (!companyId) return null;
    const result = await api.get(`/companies/${companyId}`);
    return result.data as GetCompanyByIdResponse;
}