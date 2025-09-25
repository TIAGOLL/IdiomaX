import { z } from 'zod'

export const classSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
        z.literal('attend'),
    ]),
    z.literal('Class'),
])

export type ClassSubject = z.infer<typeof classSubject>