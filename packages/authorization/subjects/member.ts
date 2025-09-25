import { z } from 'zod'

export const memberSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
        z.literal('invite'),
        z.literal('transfer_ownership'),
    ]),
    z.literal('Member'),
])

export type MemberSubject = z.infer<typeof memberSubject>