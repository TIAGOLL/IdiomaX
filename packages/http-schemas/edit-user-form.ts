import { z } from 'zod';
import { UsersSchema, GenderSchema } from './entities';

// Schema para edição de usuário no frontend (baseado nas entities)
export const editUserFormSchema = z.object({
    name: UsersSchema.shape.name,
    email: UsersSchema.shape.email,
    cpf: UsersSchema.shape.cpf,
    phone: UsersSchema.shape.phone,
    username: UsersSchema.shape.username,
    gender: GenderSchema,
    date_of_birth: UsersSchema.shape.date_of_birth,
    address: UsersSchema.shape.address,
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], { message: 'Selecione o tipo de usuário' }),
});

// Schema para alteração de senha por admin no frontend
export const adminPasswordResetFormSchema = z.object({
    newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação deve ter pelo menos 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
});

export type EditUserFormData = z.infer<typeof editUserFormSchema>;
export type AdminPasswordResetFormData = z.infer<typeof adminPasswordResetFormSchema>;