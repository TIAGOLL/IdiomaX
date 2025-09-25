import { z } from 'zod'

export const disciplineSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
    ]),
    z.literal('Discipline'),
])

export type DisciplineSubject = z.infer<typeof disciplineSubject>