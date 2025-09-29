import { z } from 'zod';
import { RoleEnum } from '../enums';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdateUserRoleFormSchema = z.object({
    role: RoleEnum,
});

// ===== API SCHEMAS (Backend Validation) =====
export const UpdateUserRoleApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    role: RoleEnum,
    company_id: z.string().uuid(),
});

export const UpdateUserRoleApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type UpdateUserRoleHttpRequest = z.infer<typeof UpdateUserRoleApiRequestSchema>;
export type UpdateUserRoleHttpResponse = z.infer<typeof UpdateUserRoleApiResponseSchema>;