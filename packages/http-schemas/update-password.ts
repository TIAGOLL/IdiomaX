import { z } from "zod";
import { UsersSchema } from "./entities";

export const studentsUpdatePasswordSchema = z.object({
    password: UsersSchema.shape.password,
    email: UsersSchema.shape.email,
});