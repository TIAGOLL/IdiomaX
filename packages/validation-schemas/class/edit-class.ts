import { z } from 'zod';

// ===== 1. FORM SCHEMAS (Frontend Formulários) =====
export const EditClassFormSchema = z.object({
    name: z.string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(256, 'Nome muito longo'),
    vacancies: z.number()
        .min(1, 'Deve haver pelo menos 1 vaga')
        .max(999, 'Limite máximo de vagas é 999'),
});

// ===== 2. API SCHEMAS (Backend Validation) =====
export const EditClassApiRequestSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(256),
    vacancies: z.number().min(1).max(999),
    company_id: z.string().uuid(),
});

export const EditClassApiResponseSchema = z.object({
    message: z.string(),
});

// ===== 3. HTTP TYPES (Frontend Services) =====
export type EditClassRequestType = z.infer<typeof EditClassApiRequestSchema>;
export type EditClassResponseType = z.infer<typeof EditClassApiResponseSchema>;
