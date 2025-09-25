import { z } from 'zod'

export const notificationSubject = z.tuple([
    z.union([
        z.literal('manage'),
        z.literal('get'),
        z.literal('create'),
        z.literal('update'),
        z.literal('delete'),
        z.literal('send'),
        z.literal('receive'),
    ]),
    z.literal('Notification'),
])

export type NotificationSubject = z.infer<typeof notificationSubject>