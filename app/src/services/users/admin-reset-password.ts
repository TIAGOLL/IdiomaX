import { api } from '../../lib/api';
import type { AdminUpdateStudentPasswordRequestType, AdminUpdateStudentPasswordResponseType } from '@idiomax/validation-schemas/users/admin-update-student-password';

export async function adminResetPassword(data: AdminUpdateStudentPasswordRequestType) {
    const response = await api.patch(`/users/admin-reset-password`, data);
    return response.data as AdminUpdateStudentPasswordResponseType;
}