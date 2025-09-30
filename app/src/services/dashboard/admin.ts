import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { type AdminDashboardApiResponse } from '@idiomax/validation-schemas/dashboard/admin-dashboard';

export async function getAdminDashboard() {
    const companyId = getCurrentCompanyId();
    console.log("Company ID:", companyId);
    const response = await api.get(`/admin-dashboard/${companyId}`);
    return response.data as AdminDashboardApiResponse;
}