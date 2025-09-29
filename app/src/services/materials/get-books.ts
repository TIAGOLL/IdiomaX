import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    GetBooksHttpParamsData,
    GetBooksHttpQueryData,
    GetBooksHttpResponseData
} from '@idiomax/validation-schemas/materials/get-books';

export type GetBooksParams = GetBooksHttpParamsData;
export type GetBooksQuery = GetBooksHttpQueryData;
export type GetBooksResponse = GetBooksHttpResponseData;

export async function getBooks(
    query?: Partial<GetBooksQuery>
): Promise<GetBooksResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/books/${companyId}`, {
        params: query
    });
    return data;
}