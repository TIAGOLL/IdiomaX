import z from "zod";
import { MaterialsSchema } from "./entities";

export const getBooksParams = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
});

export const getBooksQuery = z.object({
    levelId: z.uuid().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    active: z.coerce.boolean().optional(),
}).optional();

export const getBooksResponse = z.object({
    books: z.array(MaterialsSchema),
    totalCount: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});