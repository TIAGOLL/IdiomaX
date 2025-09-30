import { api } from '../../lib/api';
import type {
    GetCoursesRequestType,
    GetCoursesResponseType
} from '@idiomax/validation-schemas/courses/get-courses';

export async function getCourses({ company_id }: GetCoursesRequestType) {
    const response = await api.get(`/courses/${company_id}`);
    return response.data as GetCoursesResponseType;
}