import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetCoursesHttpParamsData,
    GetCoursesHttpResponseData
} from '@idiomax/validation-schemas/courses/get-courses';

export async function getCourses(data: GetCoursesHttpParamsData) {
    const response = await api.get(`/courses/${getCurrentCompanyId()}`);
    return response.data;
}