import { z } from 'zod'

export const registrationSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
        z.literal('lock'),
        z.literal('unlock'),
        z.literal('complete'),
    ]),
    z.literal('Registration'),
])

export type RegistrationSubject = z.infer<typeof registrationSubject>