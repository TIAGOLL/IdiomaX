import { z } from "zod";
import { UsersSchema } from "./entities";

export const adminUpdateStudentPasswordBody = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
    userId: z.uuid({ message: 'ID do usuário deve ser um UUID válido.' }),
    newPassword: UsersSchema.shape.password,
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
});

export type AdminUpdateStudentPasswordBody = z.infer<typeof adminUpdateStudentPasswordBody>;