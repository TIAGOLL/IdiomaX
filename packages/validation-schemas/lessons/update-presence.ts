import { z } from 'zod'

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const PresenceUpdateItemSchema = z.object({
    id: z.string().uuid(),
    is_present: z.boolean(),
})

export const UpdatePresenceFormSchema = z.object({
    presence_list: z.array(PresenceUpdateItemSchema).min(1, 'Deve haver pelo menos um estudante na lista')
})

// ===== EXPORTED TYPES =====
export type PresenceUpdateItemType = z.infer<typeof PresenceUpdateItemSchema>

// ===== API SCHEMAS (Backend Validation) =====
export const UpdatePresenceApiRequestSchema = z.object({
    lesson_id: z.string().uuid(),
    company_id: z.string().uuid(),
    presence_list: z.array(z.object({
        id: z.string().uuid(),
        is_present: z.boolean(),
    })).min(1, 'Deve haver pelo menos uma presença para atualizar')
})



export const UpdatePresenceApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type UpdatePresenceRequestType = z.infer<typeof UpdatePresenceApiRequestSchema>
export type UpdatePresenceResponseType = z.infer<typeof UpdatePresenceApiResponseSchema>