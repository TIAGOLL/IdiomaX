import z from "zod";

export const StudentsFilterSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    course: z.string().optional(),
});