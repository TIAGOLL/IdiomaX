import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const DeactivateUserFormSchema = z.object({
    active: z.boolean({
        message: 'Status de ativação é obrigatório'
    }),
});

// ===== API SCHEMAS (Backend Validation) =====
export const DeactivateUserApiRequestSchema = z.object({
    user_id: z.string().uuid(),
    company_id: z.string().uuid(),
    active: z.boolean(),
});

export const DeactivateUserApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type DeactivateUserHttpRequest = z.infer<typeof DeactivateUserApiRequestSchema>;
export type DeactivateUserHttpResponse = z.infer<typeof DeactivateUserApiResponseSchema>;