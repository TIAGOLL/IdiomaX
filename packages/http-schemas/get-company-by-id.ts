import { z } from "zod";
import { CompaniesSchema } from "./entities";

export const getCompanyByIdRequest = z.object({
    companyId: z.uuid()
})

export const getCompanyByIdResponse = CompaniesSchema.optional()