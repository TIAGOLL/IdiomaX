import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetCoursesHttpParamsData,
    GetCoursesHttpResponseData
} from '@idiomax/http-schemas/courses/get-courses';

export type GetCoursesParams = GetCoursesHttpParamsData;
export type GetCoursesResponse = GetCoursesHttpResponseData;

export async function getCourses(): Promise<GetCoursesResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/courses/${companyId}`);
    return data;
}