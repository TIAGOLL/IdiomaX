import { z } from 'zod'

export const allSubjects = z.union([
    z.literal('all'),
])

export type AllSubjects = z.infer<typeof allSubjects>