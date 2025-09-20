import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    getCourseParams,
    getCourseResponse
} from '@idiomax/http-schemas/get-courses';
import type { z } from 'zod';

export type GetCoursesParams = z.infer<typeof getCourseParams>;
export type GetCoursesResponse = z.infer<typeof getCourseResponse>;

export async function getCourses(): Promise<GetCoursesResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/courses/${companyId}`);
    return data;
}