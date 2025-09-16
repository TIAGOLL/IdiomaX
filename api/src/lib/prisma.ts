import { PrismaClient } from "../../prisma/generated/prisma";

export const prisma = new PrismaClient({
    log: ['query'],
});