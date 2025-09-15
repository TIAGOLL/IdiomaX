import { api } from "@/lib/api";
import z from "zod";

export const rolesByUserAndCompanySchema = z.object({
    companyId: z.string(),
});

type RolesByUserAndCompanyResponse = string[];

type RolesByUserAndCompanySchema = z.infer<typeof rolesByUserAndCompanySchema>;

export async function getRolesByUserAndCompany(
    data: RolesByUserAndCompanySchema
): Promise<RolesByUserAndCompanyResponse> {
    const response = await api.get<RolesByUserAndCompanyResponse>(
        '/roles-by-user-and-company',
        {
            params: data
        }
    );

    return response.data;
}