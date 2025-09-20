import { api } from '../../lib/api';
import { getCurrentCompanyId } from '../../lib/company-utils';
import type {
    getBooksParams,
    getBooksQuery,
    getBooksResponse
} from '@idiomax/http-schemas/get-books';
import type { z } from 'zod';

export type GetBooksParams = z.infer<typeof getBooksParams>;
export type GetBooksQuery = z.infer<typeof getBooksQuery>;
export type GetBooksResponse = z.infer<typeof getBooksResponse>;

export async function getBooks(
    query?: Partial<GetBooksQuery>
): Promise<GetBooksResponse> {
    const companyId = getCurrentCompanyId();

    const { data } = await api.get(`/books/${companyId}`, {
        params: query
    });
    return data;
}