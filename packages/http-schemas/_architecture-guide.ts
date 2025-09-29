// ============================================================================
// NOVA ARQUITETURA DE SCHEMAS
// ============================================================================
// Cada arquivo de ação terá 3 tipagens independentes:
// 1. FormSchema - Para formulários web com mensagens de erro traduzidas
// 2. ApiRequestSchema/ApiResponseSchema - Para validação da API no backend  
// 3. HttpRequestType/HttpResponseType - Types inferidos para services HTTP frontend

import { z } from 'zod';
import { RoleEnum } from './enums';

// ===== 1. FORM SCHEMAS (Frontend Formulários) =====
// Schemas com mensagens de erro traduzidas para o usuário
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
    password: z.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    role: RoleEnum,
}).refine(data => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword']
});

// ===== 2. API SCHEMAS (Backend Validation) =====
// Schemas para validação rigorosa da API
export const CreateUserApiRequestSchema = z.object({
    name: z.string().min(2).max(256),
    email: z.string().email().max(256),
    cpf: z.string().length(11).regex(/^\d{11}$/),
    password: z.string().min(6).max(1024),
    role: RoleEnum,
    company_id: z.string().uuid(),
});

export const CreateUserApiResponseSchema = z.object({
    message: z.string(),
});

// ===== 3. HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type CreateUserHttpRequest = z.infer<typeof CreateUserApiRequestSchema>;
export type CreateUserHttpResponse = z.infer<typeof CreateUserApiResponseSchema>;

// Convenção de nomenclatura:
// - FormSchema: Para formulários com validação de UI
// - ApiRequestSchema/ApiResponseSchema: Para validação do backend
// - HttpRequestType/HttpResponseType: Types para services do frontend