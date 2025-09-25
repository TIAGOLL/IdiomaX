import { z } from 'zod'

export const levelSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
    ]),
    z.literal('Level'),
])

export type LevelSubject = z.infer<typeof levelSubject>