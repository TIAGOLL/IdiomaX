import z from "zod";

// Enum para roles disponíveis
export const UserRoleSchema = z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
    message: 'Role deve ser STUDENT, TEACHER ou ADMIN.'
});

// Schema para query de busca de usuários
export const getUsersQuery = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(10000).default(10), // Aumentado para permitir buscar todos
    search: z.string().optional(),
    active: z.coerce.boolean().optional(),
    role: UserRoleSchema.optional(), // Role agora é opcional
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
        member_on: z.array(z.object({
            company_id: z.uuid(),
            role: UserRoleSchema,
        })).optional(),
    })),
    totalCount: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuery>;
export type GetUsersResponse = z.infer<typeof getUsersResponse>;

// Tipo específico para um usuário na resposta da API
export type UserWithMember = GetUsersResponse['users'][0];

// Tipo para usuário com role da empresa atual (usado nos componentes)
export type UserWithRole = UserWithMember & { role: UserRole };