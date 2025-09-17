import { api } from "@/lib/api";
import { dashboardAdminRequest, dashboardAdminResponse } from "@idiomax/http-schemas/admin-dashboard";
import type z from "zod";

type DashboardAdminResponse = z.infer<typeof dashboardAdminResponse>;
type DashboardAdminRequest = z.infer<typeof dashboardAdminRequest>;

export async function getAdminDashboard({ company }: DashboardAdminRequest) {
    const response = await api.get(`/admin-dashboard/${company}`);
    return response.data as DashboardAdminResponse;
}