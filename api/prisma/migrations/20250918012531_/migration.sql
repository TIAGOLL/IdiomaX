/*
  Warnings:

  - Changed the type of `gender` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('M', 'F');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "gender",
ADD COLUMN     "gender" "public"."Gender" NOT NULL;
