import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateUserFormSchema = z.object({
    name: z.string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(256, 'Nome muito longo'),
    email: z.string()
        .email('Email inválido')
        .max(256, 'Email muito longo'),
    cpf: z.string()
        .length(11, 'CPF deve ter exatamente 11 dígitos')
        .regex(/^\d{11}$/, 'CPF deve conter apenas números'),
    phone: z.string()
        .min(10, 'Telefone muito curto')
        .max(15, 'Telefone muito longo')
        .regex(/^\d+$/, 'Telefone deve conter apenas números'),
    username: z.string()
        .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
        .max(256, 'Nome de usuário muito longo')
        .regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscore'),
    gender: z.enum(['M', 'F'], {
        message: 'Selecione o gênero'
    }),
    date_of_birth: z.date({
        message: 'Data de nascimento é obrigatória'
    }),
    address: z.string()
        .min(5, 'Endereço muito curto')
        .max(256, 'Endereço muito longo'),
});

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateUserApiRequestSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(256),
    email: z.string().email().max(256),
    cpf: z.string().length(11).regex(/^\d{11}$/),
    phone: z.string().min(10).max(15).regex(/^\d+$/),
    username: z.string().min(3).max(256).regex(/^[a-zA-Z0-9_]+$/),
    gender: z.enum(['M', 'F']),
    dateOfBirth: z.date(),
    address: z.string().min(5).max(256),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
    companyId: z.string().uuid(),
    avatar_url: z.string().url().nullable().optional(),
});

export const UpdateUserApiResponseSchema = z.object({
    message: z.string(),
    user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string(),
        username: z.string(),
        role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
        updated_at: z.date(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateUserHttpRequest = z.infer<typeof UpdateUserApiRequestSchema>;
export type UpdateUserHttpResponse = z.infer<typeof UpdateUserApiResponseSchema>;