import { z } from "zod";

// Schema de usuários em turma
export const UsersInClassSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID deve ser um UUID válido.' }),

    class_id: z.string()
        .uuid({ message: 'ID da turma deve ser um UUID válido.' }),

    users_id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    teacher: z.boolean({ message: 'Campo professor deve ser verdadeiro ou falso.' }),
});

// Schema para criação de usuário em turma
export const CreateUserInClassSchema = UsersInClassSchema.omit({
    id: true,
});

// Schema para atualização de usuário em turma
export const UpdateUserInClassSchema = UsersInClassSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID deve ser um UUID válido.' }),
    });

// Schema para adicionar aluno à turma
export const AddStudentToClassSchema = z.object({
    class_id: z.string()
        .uuid({ message: 'ID da turma deve ser um UUID válido.' }),

    users_id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    teacher: z.boolean()
        .default(false),
});

// Schema para adicionar professor à turma
export const AddTeacherToClassSchema = z.object({
    class_id: z.string()
        .uuid({ message: 'ID da turma deve ser um UUID válido.' }),

    users_id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    teacher: z.boolean()
        .default(true),
});

// Tipos TypeScript
export type UserInClass = z.infer<typeof UsersInClassSchema>;
export type CreateUserInClass = z.infer<typeof CreateUserInClassSchema>;
export type UpdateUserInClass = z.infer<typeof UpdateUserInClassSchema>;
export type AddStudentToClass = z.infer<typeof AddStudentToClassSchema>;
export type AddTeacherToClass = z.infer<typeof AddTeacherToClassSchema>;