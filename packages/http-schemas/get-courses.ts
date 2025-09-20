import z from "zod";
import { CoursesSchema } from "./entities";

export const getCourseParams = z.object({
    companyId: z.uuid(),
});

export const getCourseResponse = z.array(CoursesSchema);
