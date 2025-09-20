import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { getCompanyByIdResponse } from "@idiomax/http-schemas/get-company-by-id";
import type z from "zod";

type GetCompanyByIdResponse = z.infer<typeof getCompanyByIdResponse>;

export async function getCompanyById() {
    const companyId = getCurrentCompanyId();

    if (!companyId) return null;
    const result = await api.get(`/companies/${companyId}`);
    return result.data as GetCompanyByIdResponse;
}