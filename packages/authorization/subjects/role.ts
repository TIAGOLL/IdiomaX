import { z } from 'zod'

export const roleSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('update'),
        z.literal('delete'),
    ]),
    z.literal('Role'),
])

export type RoleSubject = z.infer<typeof roleSubject>