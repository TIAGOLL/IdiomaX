import { z } from 'zod'

export const presenceSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
        z.literal('mark'),
    ]),
    z.literal('Presence'),
])

export type PresenceSubject = z.infer<typeof presenceSubject>