import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const UpdatePresenceFormSchema = z.object({
    presence_list: z.array(z.object({
        id: z.string().uuid(),
        is_present: z.boolean(),
    })).min(1, 'Deve haver pelo menos um estudante na lista')
})

// ===== API SCHEMAS (Backend Validation) =====
export const UpdatePresenceApiRequestSchema = z.object({
    lesson_id: z.string().uuid(),
    company_id: z.string().uuid(),
    presence_list: z.array(z.object({
        id: z.string().uuid(),
        is_present: z.boolean(),
    }))
})

export const UpdatePresenceApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type UpdatePresenceRequestType = z.infer<typeof UpdatePresenceApiRequestSchema>
export type UpdatePresenceResponseType = z.infer<typeof UpdatePresenceApiResponseSchema>