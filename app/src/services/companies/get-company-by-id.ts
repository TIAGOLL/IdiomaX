import { api } from "@/lib/api";
import type { GetCompanyByIdRequestType, GetCompanyByIdResponseType } from "@idiomax/validation-schemas/companies/get-company-by-id";

export async function getCompanyById({ company_id }: GetCompanyByIdRequestType) {
    const result = await api.get(`/companies/${company_id}`);
    return result.data as GetCompanyByIdResponseType;
}