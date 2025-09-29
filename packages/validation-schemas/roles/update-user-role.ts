import { z } from 'zod';
import { RoleEnum } from '../enums';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateUserRoleFormSchema = z.object({
    role: RoleEnum,
});

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateUserRoleApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    companies_id: z.string().uuid(),
    role: RoleEnum,
});

export const UpdateUserRoleApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type UpdateUserRoleRequestType = z.infer<typeof UpdateUserRoleApiRequestSchema>;
export type UpdateUserRoleResponseType = z.infer<typeof UpdateUserRoleApiResponseSchema>;