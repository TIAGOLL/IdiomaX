import { z } from "zod";
import { UserProfileSchema, RoleSchema, CompaniesSchema } from "./entities";

export const getUserProfileResponse = UserProfileSchema.safeExtend({
    member_on: z.array(
        z.object({
            id: z.uuid(),
            role: RoleSchema,
            company_id: z.uuid(),
            user_id: z.uuid(),
            company: CompaniesSchema.safeExtend({
                owner_id: z.string(),
            }),
        })
    )
})