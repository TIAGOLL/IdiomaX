import z from "zod";
import { UserRoleSchema } from "./get-users";

export const getUserByEmailQuery = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    email: z.email({ message: 'Email deve ser um endereço válido.' }),
    role: UserRoleSchema, // Role obrigatório na query
});

export const getUserByEmailResponse = z.object({
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
}).nullable();

export type GetUserByEmailQuery = z.infer<typeof getUserByEmailQuery>;
export type GetUserByEmailResponse = z.infer<typeof getUserByEmailResponse>;