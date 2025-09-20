import z from "zod";

// Enum para roles disponíveis
export const UserRoleSchema = z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
    message: 'Role deve ser STUDENT, TEACHER ou ADMIN.'
});

// Schema para parâmetros de company e role
export const getUsersParams = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
});

// Schema para query de busca de usuários
export const getUsersQuery = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    active: z.coerce.boolean().optional(),
    role: UserRoleSchema, // Role obrigatório na query
});

// Schema para response de listagem de usuários
export const getUsersResponse = z.object({
    users: z.array(z.object({
        id: z.uuid(),
        name: z.string(),
        email: z.email(),
        cpf: z.string(),
        phone: z.string(),
        username: z.string(),
        gender: z.enum(['M', 'F']),
        date_of_birth: z.date(),
        address: z.string(),
        avatar_url: z.string().nullable(),
        active: z.boolean(),
        created_at: z.date(),
        updated_at: z.date(),
        created_by: z.uuid(),
        updated_by: z.uuid().nullable(),
    })),
    totalCount: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type GetUsersParams = z.infer<typeof getUsersParams>;
export type GetUsersQuery = z.infer<typeof getUsersQuery>;
export type GetUsersResponse = z.infer<typeof getUsersResponse>;