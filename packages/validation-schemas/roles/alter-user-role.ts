import { z } from 'zod';
import { RoleEnum } from '../enums';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const AlterUserRoleFormSchema = z.object({
    role: RoleEnum,
});

// ===== API SCHEMAS (Backend Validation) =====
export const AlterUserRoleApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    role: RoleEnum,
});

export const AlterUserRoleApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type AlterUserRoleRequestType = z.infer<typeof AlterUserRoleApiRequestSchema>;
export type AlterUserRoleResponseType = z.infer<typeof AlterUserRoleApiResponseSchema>;