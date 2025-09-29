import { z } from 'zod';
import { RoleEnum } from '../enums';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const DeleteUserRoleFormSchema = z.object({
    userId: z.string().uuid('ID do usuário inválido'),
    companyId: z.string().uuid('ID da empresa inválido'),
    role: RoleEnum,
});

// ===== API SCHEMAS (Backend Validation) =====
export const DeleteUserRoleApiRequestSchema = z.object({
    userId: z.string().uuid(),
    companyId: z.string().uuid(),
    role: RoleEnum,
});

export const DeleteUserRoleApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type DeleteUserRoleHttpRequest = z.infer<typeof DeleteUserRoleApiRequestSchema>;
export type DeleteUserRoleHttpResponse = z.infer<typeof DeleteUserRoleApiResponseSchema>;