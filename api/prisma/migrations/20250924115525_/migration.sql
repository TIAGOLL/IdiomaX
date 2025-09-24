/*
  Warnings:

  - You are about to drop the column `companiesId` on the `classrooms` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `configs` table. All the data in the column will be lost.
  - You are about to drop the column `levelsId` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the column `coursesId` on the `levels` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."disciplines" DROP CONSTRAINT "disciplines_levelsId_fkey";

-- AlterTable
ALTER TABLE "public"."classrooms" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "public"."configs" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "public"."disciplines" DROP COLUMN "levelsId";

-- AlterTable
ALTER TABLE "public"."levels" DROP COLUMN "coursesId";

-- AddForeignKey
ALTER TABLE "public"."disciplines" ADD CONSTRAINT "disciplines_levels_id_fkey" FOREIGN KEY ("levels_id") REFERENCES "public"."levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
