import { api } from "@/lib/api";
import type { CreateCompanyHttpRequest, CreateCompanyHttpResponse } from "@idiomax/http-schemas/companies/create-company";

export async function createCompany(data: CreateCompanyHttpRequest) {
    const response = await api.post(`/companies`, data);
    return response.data as CreateCompanyHttpResponse;
}
