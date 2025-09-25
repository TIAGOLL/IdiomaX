import { z } from 'zod'

export const courseSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
    ]),
    z.literal('Course'),
])

export type CourseSubject = z.infer<typeof courseSubject>