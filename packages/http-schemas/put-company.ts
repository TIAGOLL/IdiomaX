import { z } from "zod";
import { UpdateCompanySchema } from "./entities";

export const putCompanyRequest = UpdateCompanySchema;

export const putCompanyResponse = z.object({
    message: z.string(),
});