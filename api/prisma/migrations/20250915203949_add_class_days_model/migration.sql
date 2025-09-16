/*
  Warnings:

  - You are about to drop the column `final_date` on the `class_days` table. All the data in the column will be lost.
  - You are about to drop the column `initial_date` on the `class_days` table. All the data in the column will be lost.
  - Added the required column `week_date` to the `class_days` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."WeekDays" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "public"."class_days" DROP COLUMN "final_date",
DROP COLUMN "initial_date",
ADD COLUMN     "week_date" "public"."WeekDays" NOT NULL;
