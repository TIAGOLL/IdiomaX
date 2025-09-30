import { z } from 'zod';
import { RoleEnum } from '../enums';

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
    gender: z.enum(['M', 'F'], {
        message: 'Selecione o gênero'
    }),
    date_of_birth: z.date({
        message: 'Data de nascimento é obrigatória'
    }).refine((dateStr) => {
        const minAge = 5;
        const today = new Date();
        const birthDate = new Date(dateStr);
        const ageDiffMs = today.getTime() - birthDate.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (age < minAge) {
            return false
        }
        return true;
    }, { message: 'O usuário deve ter pelo menos 5 anos' }),
    address: z.string()
        .min(5, 'Endereço muito curto')
        .max(256, 'Endereço muito longo'),
    role: RoleEnum,
    company_id: z.string()
        .uuid('ID da empresa inválido'),
})

// ===== API SCHEMAS (Backend Validation) =====
export const CreateUserApiRequestSchema = z.object({
    name: z.string().min(2).max(256),
    email: z.string().email().max(256),
    cpf: z.string().length(11).regex(/^\d{11}$/),
    phone: z.string().min(10).max(15).regex(/^\d+$/),
    username: z.string().min(3).max(256).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(6).max(1024),
    gender: z.enum(['M', 'F']),
    date_of_birth: z.string().transform((str) => new Date(str)),
    address: z.string().min(5).max(256),
    role: RoleEnum,
    company_id: z.string().uuid(),
    avatar_url: z.string().url().nullable().optional(),
});

export const CreateUserApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export const CreateUserHttpRequestSchema = z.object({
    name: z.string().min(2).max(256),
    email: z.string().email().max(256),
    cpf: z.string().length(11).regex(/^\d{11}$/),
    phone: z.string().min(10).max(15).regex(/^\d+$/),
    username: z.string().min(3).max(256).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(6).max(1024),
    gender: z.enum(['M', 'F']),
    date_of_birth: z.date(),
    address: z.string().min(5).max(256),
    role: RoleEnum,
    company_id: z.string().uuid(),
    avatar_url: z.string().url().nullable().optional(),
});

export type CreateUserHttpRequest = z.infer<typeof CreateUserHttpRequestSchema>;
export type CreateUserHttpResponse = z.infer<typeof CreateUserApiResponseSchema>;
