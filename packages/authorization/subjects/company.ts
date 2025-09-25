import { z } from 'zod'

export const companySubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
    ]),
    z.literal('Company'),
])

export type CompanySubject = z.infer<typeof companySubject>