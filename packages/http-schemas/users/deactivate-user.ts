import { z } from 'zod';

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const DeactivateUserFormSchema = z.object({
    userId: z.string()
        .uuid('ID do usuário é obrigatório'),
    active: z.boolean({
        message: 'Status de ativação é obrigatório'
    }),
    reason: z.string()
        .max(500, 'Motivo muito longo')
        .optional(),
});

// ===== API SCHEMAS (Backend Validation) =====
export const DeactivateUserApiRequestSchema = z.object({
    userId: z.string().uuid(),
    companyId: z.string().uuid(),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
    active: z.boolean(),
});

export const DeactivateUserApiResponseSchema = z.object({
    message: z.string(),
    user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        active: z.boolean(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type DeactivateUserHttpRequest = z.infer<typeof DeactivateUserApiRequestSchema>;
export type DeactivateUserHttpResponse = z.infer<typeof DeactivateUserApiResponseSchema>;