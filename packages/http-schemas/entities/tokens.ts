import { z } from "zod";

// Schema de tokens
export const TokensSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID do token deve ser um UUID válido.' }),

    type: z.string()
        .min(1, { message: 'Tipo do token deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Tipo do token deve ter no máximo 256 caracteres.' }),

    expires_at: z.coerce.date({ message: 'Data de expiração deve ser uma data válida.' }),

    users_id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    created_at: z.coerce.date()
        .default(() => new Date()),
});

// Schema para criação de token
export const CreateTokenSchema = TokensSchema.omit({
    id: true,
    created_at: true,
});

// Schema para validação de token
export const ValidateTokenSchema = z.object({
    token: z.string()
        .uuid({ message: 'Token deve ser um UUID válido.' }),

    type: z.string()
        .min(1, { message: 'Tipo do token é obrigatório.' }),
});

// Schema para token de recuperação de senha
export const PasswordRecoveryTokenSchema = z.object({
    users_id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    type: z.literal('password_recovery', { message: 'Tipo deve ser password_recovery.' }),

    expires_at: z.coerce.date({ message: 'Data de expiração deve ser uma data válida.' })
        .default(() => {
            const date = new Date();
            date.setHours(date.getHours() + 1); // Expira em 1 hora
            return date;
        }),
});

// Schema para token de verificação de email
export const EmailVerificationTokenSchema = z.object({
    users_id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    type: z.literal('email_verification', { message: 'Tipo deve ser email_verification.' }),

    expires_at: z.coerce.date({ message: 'Data de expiração deve ser uma data válida.' })
        .default(() => {
            const date = new Date();
            date.setDate(date.getDate() + 7); // Expira em 7 dias
            return date;
        }),
});

// Tipos TypeScript
export type Token = z.infer<typeof TokensSchema>;
export type CreateToken = z.infer<typeof CreateTokenSchema>;
export type ValidateToken = z.infer<typeof ValidateTokenSchema>;
export type PasswordRecoveryToken = z.infer<typeof PasswordRecoveryTokenSchema>;
export type EmailVerificationToken = z.infer<typeof EmailVerificationTokenSchema>;