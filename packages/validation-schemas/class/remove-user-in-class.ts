import { z } from "zod";

// ===== 1. API SCHEMAS (Backend) =====
export const RemoveUserInClassApiRequestSchema = z.object({
    user_in_class_id: z.string().uuid(),
    company_id: z.string().uuid(),
});

export const RemoveUserInClassApiResponseSchema = z.object({
    message: z.string(),
});

// ===== 2. HTTP TYPES (Frontend Services) =====
export type RemoveUserInClassRequestType = z.infer<typeof RemoveUserInClassApiRequestSchema>;
export type RemoveUserInClassResponseType = z.infer<typeof RemoveUserInClassApiResponseSchema>;