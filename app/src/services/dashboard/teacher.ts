import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { type TeacherDashboardApiResponse } from '@idiomax/validation-schemas/dashboard/teacher-dashboard';

export async function getTeacherDashboard() {
    const companyId = getCurrentCompanyId();
    const response = await api.get(`/teacher-dashboard/${companyId}`);
    return response.data as TeacherDashboardApiResponse;
}
