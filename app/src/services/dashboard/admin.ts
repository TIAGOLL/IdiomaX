import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { dashboardAdminResponse } from "@idiomax/http-schemas/admin-dashboard";
import type z from "zod";

type DashboardAdminResponse = z.infer<typeof dashboardAdminResponse>;

export async function getAdminDashboard() {
    const companyId = getCurrentCompanyId();

    const response = await api.get(`/admin-dashboard/${companyId}`);
    return response.data as DashboardAdminResponse;
}