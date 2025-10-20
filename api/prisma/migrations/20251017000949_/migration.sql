/*
  Warnings:

  - You are about to drop the column `coursesId` on the `registrations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."registrations" DROP CONSTRAINT "registrations_coursesId_fkey";

-- AlterTable
ALTER TABLE "public"."registrations" DROP COLUMN "coursesId";

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "registrations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
