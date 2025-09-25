import { z } from 'zod'

export const classroomSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
    ]),
    z.literal('Classroom'),
])

export type ClassroomSubject = z.infer<typeof classroomSubject>