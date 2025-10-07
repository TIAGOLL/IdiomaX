import { z } from 'zod'

// ===== SHARED SCHEMAS FOR PRESENCE =====

// Schema básico para um item da lista de presença
export const PresenceItemSchema = z.object({
    id: z.string(),
    is_present: z.boolean(),
    user_id: z.string(),
    users: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    })
})

// Schema para usuário em turma
export const UserInClassSchema = z.object({
    user_id: z.string(),
    teacher: z.boolean(),
    users: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    })
})

// Schema para informações da turma
export const ClassInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    vacancies: z.number(),
    courses: z.object({
        name: z.string(),
    }),
    users_in_class: z.array(UserInClassSchema)
})

// ===== EXPORTED TYPES =====
export type PresenceItemType = z.infer<typeof PresenceItemSchema>
export type UserInClassType = z.infer<typeof UserInClassSchema>
export type ClassInfoType = z.infer<typeof ClassInfoSchema>