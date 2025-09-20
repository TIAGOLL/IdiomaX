import { z } from "zod";
import { StripeCompanySubscriptionSchema, StripeCompanyCustomerSchema, StripePriceSchema, StripeProductSchema } from "./entities";
import { getCompanyByIdResponse } from "./get-company-by-id";

export const getCompanySubscriptionResponse = StripeCompanySubscriptionSchema.safeExtend({
    company_customer: StripeCompanyCustomerSchema.safeExtend({
        company: getCompanyByIdResponse.optional()
    }).optional(),
    price: StripePriceSchema.safeExtend({
        product: StripeProductSchema
    })
});

export const getCompanySubscriptionParams = z.object({
    companyId: z.uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
});