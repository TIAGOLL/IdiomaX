import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateUserFormSchema = z.object({
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
    password: z.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(1024, 'Senha muito longa'),
    confirmPassword: z.string(),
    gender: z.enum(['M', 'F'], {
        message: 'Selecione o gênero'
    }),
    dateOfBirth: z.date({
        message: 'Data de nascimento é obrigatória'
    }),
    address: z.string()
        .min(5, 'Endereço muito curto')
        .max(256, 'Endereço muito longo'),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
        message: 'Selecione o tipo de usuário'
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword']
});

// ===== API SCHEMAS (Backend Validation) =====
export const CreateUserApiRequestSchema = z.object({
    name: z.string().min(2).max(256),
    email: z.string().email().max(256),
    cpf: z.string().length(11).regex(/^\d{11}$/),
    phone: z.string().min(10).max(15).regex(/^\d+$/),
    username: z.string().min(3).max(256).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(6).max(1024),
    gender: z.enum(['M', 'F']),
    date_of_birth: z.date(),
    address: z.string().min(5).max(256),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
    company_id: z.string().uuid(),
    avatar_url: z.string().url().nullable().optional(),
});

export const CreateUserApiResponseSchema = z.object({
    message: z.string(),
    user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string(),
        username: z.string(),
        role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
        active: z.boolean(),
        created_at: z.date(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type CreateUserHttpRequest = z.infer<typeof CreateUserApiRequestSchema>;
export type CreateUserHttpResponse = z.infer<typeof CreateUserApiResponseSchema>;