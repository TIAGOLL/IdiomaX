import { z } from 'zod'

export const GetClassroomsResponseSchema = z.array(z.object({
    id: z.string(),
    number: z.union([z.number(), z.string()]).transform((val) => Number(val)),
    block: z.string(),
    companies_id: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    active: z.boolean()
}))

export const GetClassroomsQuerySchema = z.object({
    companies_id: z.string()
})