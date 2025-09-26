import { z } from 'zod'

export const roleSchema = z.union([
    z.literal('ADMIN'),
    z.literal('TEACHER'),
    z.literal('STUDENT'),
])

export type Role = z.infer<typeof roleSchema>
