/*
  Warnings:

  - Added the required column `course_id` to the `registrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."registrations" ADD COLUMN     "course_id" VARCHAR(256) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "courses_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
