import { z } from 'zod';

// ===== API SCHEMAS (Backend Validation) =====
export const DeleteUserApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
});

export const DeleteUserApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
// Types inferidos dos schemas da API para services HTTP
export type DeleteUserRequestType = z.infer<typeof DeleteUserApiRequestSchema>;
export type DeleteUserResponseType = z.infer<typeof DeleteUserApiResponseSchema>;