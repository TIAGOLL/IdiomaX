import { z } from "zod";
import { auditFieldsSchema, auditFieldsForCreate, auditFieldsForUpdate } from "../lib/audit-fields";

// Enum para Role
export const RoleSchema = z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
    message: 'Função deve ser STUDENT, TEACHER ou ADMIN.'
});

// Schema principal de membros
export const MembersSchema = z.object({
    id: z
        .uuid({ message: 'ID do membro deve ser um UUID válido.' }),

    role: RoleSchema,

    company_id: z
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),

    user_id: z
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
})
    .merge(auditFieldsSchema);

// Schema para criação de membro
export const CreateMemberSchema = MembersSchema.omit({
    id: true,
}).merge(auditFieldsForCreate);

// Schema para atualização de membro
export const UpdateMemberSchema = MembersSchema.omit({
    created_at: true,
    created_by: true,
}).partial().extend({
    id: z.uuid({ message: 'ID do membro deve ser um UUID válido.' }),
}).merge(auditFieldsForUpdate);

// Schema para convite de membro
export const InviteMemberSchema = z.object({
    email: z
        .email({ message: 'Email deve ser um endereço válido.' }),

    role: RoleSchema,

    company_id: z
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
});

// Tipos TypeScript
export type Member = z.infer<typeof MembersSchema>;
export type CreateMember = z.infer<typeof CreateMemberSchema>;
export type UpdateMember = z.infer<typeof UpdateMemberSchema>;
export type InviteMember = z.infer<typeof InviteMemberSchema>;
export type Role = z.infer<typeof RoleSchema>;