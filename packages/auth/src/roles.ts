import { z } from 'zod'

export const roleSchema = z.union([
  z.literal('ADMIN'),
  z.literal('STUDENT'),
  z.literal('TEACHER'),
])
 
export type Role = z.infer<typeof roleSchema>
