import { z } from 'zod'

export const companySchema = z.object({
    id: z.string(),
    owner_id: z.string(),
    __typename: z.literal('Company').default('Company'),
})

export type Company = z.infer<typeof companySchema>