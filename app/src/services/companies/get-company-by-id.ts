import { api } from "@/lib/api";
import { getCompanyByIdResponse, getCompanyByIdRequest } from "@idiomax/http-schemas/get-company-by-id";
import type z from "zod";

type GetCompanyByIdRequest = z.infer<typeof getCompanyByIdRequest>;
type GetCompanyByIdResponse = z.infer<typeof getCompanyByIdResponse>;

export async function getCompanyById({ companyId }: GetCompanyByIdRequest) {
    if (!companyId) return null;
    const result = await api.get(`/companies/${companyId}`);
    return result.data as GetCompanyByIdResponse;
}