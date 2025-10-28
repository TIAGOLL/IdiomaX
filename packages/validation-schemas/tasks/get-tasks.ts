import { z } from 'zod';

// ===== API SCHEMAS (Backend Validation) =====
export const GetTasksApiRequestSchema = z.object({
    discipline_id: z.string().uuid(),
});

export const GetTasksApiResponseSchema = z.array(
    z.object({
        id: z.string().uuid(),
        title: z.string(),
        description: z.string().nullable(),
        value: z.number(),
        submit_date: z.string(), // Time será string no JSON
        file: z.any().nullable(), // Bytes como base64 ou null
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
    })
);

// ===== HTTP TYPES (Frontend Services) =====
export type GetTasksRequestType = z.infer<typeof GetTasksApiRequestSchema>;
export type GetTasksResponseType = z.infer<typeof GetTasksApiResponseSchema>;
