import { z } from 'zod';

// ===== API SCHEMAS (Backend Validation) =====
export const DeleteTaskApiResponseSchema = z.object({
    message: z.string(),
});

// ===== HTTP TYPES (Frontend Services) =====
export type DeleteTaskResponseType = z.infer<typeof DeleteTaskApiResponseSchema>;
