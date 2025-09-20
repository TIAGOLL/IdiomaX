import { z } from "zod";
import { CreateCompanySchema } from "./entities";

// Remove owner_id da criação pois é definido automaticamente
export const createCompanyRequest = CreateCompanySchema.omit({
    owner_id: true,
});

export const createCompanyResponse = z.object({
    message: z.string(),
    companyId: z.string(),
});