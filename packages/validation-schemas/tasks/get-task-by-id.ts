import { z } from 'zod';

// ===== API SCHEMAS (Backend Validation) =====
export const GetTaskByIdApiResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    value: z.number(),
    submit_date: z.string(),
    file: z.any().nullable(),
    discipline_id: z.string().uuid(),
    created_at: z.string(),
    updated_at: z.string(),
    created_by: z.string().uuid(),
    updated_by: z.string().uuid(),
    active: z.boolean(),
    discipline: z.object({
        id: z.string().uuid(),
        name: z.string(),
    }),
});

// ===== HTTP TYPES (Frontend Services) =====
export type GetTaskByIdResponseType = z.infer<typeof GetTaskByIdApiResponseSchema>;
