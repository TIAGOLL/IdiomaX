import { api } from "@/lib/api";
import z from "zod";
import { createCompanyRequest, createCompanyResponse } from "@idiomax/http-schemas/create-company";

type CreateCompanyRequest = z.infer<typeof createCompanyRequest>;
type CreateCompanyResponse = z.infer<typeof createCompanyResponse>;

export async function createCompany(data: CreateCompanyRequest) {
    const response = await api.post(`/create-companies`, data);
    return response.data as CreateCompanyResponse;
}
