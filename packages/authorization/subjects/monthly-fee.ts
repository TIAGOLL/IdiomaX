import { z } from 'zod'

export const monthlyFeeSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
        z.literal('pay'),
    ]),
    z.literal('MonthlyFee'),
])

export type MonthlyFeeSubject = z.infer<typeof monthlyFeeSubject>