import { z } from 'zod'

export const taskSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
        z.literal('submit'),
        z.literal('grade'),
    ]),
    z.literal('Task'),
])

export type TaskSubject = z.infer<typeof taskSubject>