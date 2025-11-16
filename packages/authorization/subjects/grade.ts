import { z } from 'zod'

export const gradeSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
    ]),
    z.literal('Grade'),
])

export type GradeSubject = z.infer<typeof gradeSubject>
