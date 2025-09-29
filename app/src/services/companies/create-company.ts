import { api } from "@/lib/api";
import type { CreateCompanyRequestType, CreateCompanyResponseType } from "@idiomax/validation-schemas/companies/create-company";

export async function createCompany(data: CreateCompanyRequestType) {
    const response = await api.post(`/companies`, data);
    return response.data as CreateCompanyResponseType;
}
