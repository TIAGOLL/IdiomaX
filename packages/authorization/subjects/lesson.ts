import { z } from 'zod'

export const lessonSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
    ]),
    z.literal('Lesson'),
])

export type LessonSubject = z.infer<typeof lessonSubject>