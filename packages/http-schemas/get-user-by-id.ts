import { z } from "zod";
import { UsersSchema } from "./entities";

export const getUserByIdRequest = z.object({
    id: z.uuid(),
    companyId: z.uuid(),
})

export const getUserByIdResponse = UsersSchema