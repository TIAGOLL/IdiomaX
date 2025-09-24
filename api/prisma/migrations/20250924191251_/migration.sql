/*
  Warnings:

  - You are about to drop the column `companiesId` on the `registrations` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `registrations` table. All the data in the column will be lost.
  - Made the column `block` on table `classrooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companies_id` on table `classrooms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."classrooms" ALTER COLUMN "block" SET NOT NULL,
ALTER COLUMN "companies_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."registrations" DROP COLUMN "companiesId",
DROP COLUMN "usersId";
