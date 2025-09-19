import z from "zod";

export const getPricesResponse = z.object({
    id: z.string(),
    product_id: z.string(),
    active: z.boolean(),
    description: z.string().nullable(),
    unit_amount: z.union([z.bigint(), z.string(), z.number()]).transform(val => val?.toString()),
    currency: z.string(),
    type: z.enum(["one_time", "recurring"]),
    interval: z.enum(["day", "week", "month", "year"]).nullable(),
    interval_count: z.number().nullable(),
    trial_period_days: z.number().nullable(),
    metadata: z.unknown().nullable(),
    product: z.object({
        id: z.string(),
        active: z.boolean(),
        name: z.string(),
        description: z.string().nullable(),
        image: z.string().nullable(),
        metadata: z.unknown().nullable(),
    }).optional().nullable(),
});