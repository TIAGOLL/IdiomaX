import { api } from "@/lib/api";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { type StudentDashboardApiResponse } from '@idiomax/validation-schemas/dashboard/student-dashboard';

export async function getStudentDashboard() {
    const companyId = getCurrentCompanyId();
    const response = await api.get(`/student-dashboard/${companyId}`);
    return response.data as StudentDashboardApiResponse;
}
