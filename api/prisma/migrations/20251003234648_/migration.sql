/*
  Warnings:

  - Added the required column `end_date` to the `registrations` table without a default value. This is not possible if the table is not empty.
  - Made the column `locked` on table `registrations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `completed` on table `registrations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `registrations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `registrations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."registrations" ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "start_date" DROP DEFAULT,
ALTER COLUMN "locked" SET NOT NULL,
ALTER COLUMN "completed" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "company_id" SET NOT NULL;
