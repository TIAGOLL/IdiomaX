import { z } from 'zod'

export const materialSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
        z.literal('download'),
    ]),
    z.literal('Material'),
])

export type MaterialSubject = z.infer<typeof materialSubject>