import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import type { AdminDashboardHttpResponseData } from "@idiomax/http-schemas/dashboard/admin-dashboard";

type DashboardAdminResponse = AdminDashboardHttpResponseData;

export async function getAdminDashboard() {
    const companyId = getCurrentCompanyId();

    const response = await api.get(`/admin-dashboard/${companyId}`);
    return response.data as DashboardAdminResponse;
}