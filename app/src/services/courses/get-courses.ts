import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetCoursesHttpParamsData,
    GetCoursesHttpResponseData
} from '@idiomax/http-schemas/courses/get-courses';

export async function getCourses(data: GetCoursesHttpParamsData): Promise<GetCoursesHttpResponseData> {
    const response = await api.get(`/courses/${getCurrentCompanyId()}`);
    return response.data;
}