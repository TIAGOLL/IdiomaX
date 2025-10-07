/*
  Warnings:

  - You are about to drop the column `class_id` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the `class` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `course_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vacancies` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."class" DROP CONSTRAINT "class_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."class" DROP CONSTRAINT "class_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."class" DROP CONSTRAINT "courses_fk";

-- DropForeignKey
ALTER TABLE "public"."class_days" DROP CONSTRAINT "class_fk";

-- DropForeignKey
ALTER TABLE "public"."classes" DROP CONSTRAINT "class_fk";

-- DropForeignKey
ALTER TABLE "public"."presence_lists" DROP CONSTRAINT "classes_fk";

-- DropForeignKey
ALTER TABLE "public"."users_in_class" DROP CONSTRAINT "class_fk";

-- AlterTable
ALTER TABLE "public"."classes" DROP COLUMN "class_id",
DROP COLUMN "end_date",
DROP COLUMN "start_date",
DROP COLUMN "theme",
ADD COLUMN     "course_id" VARCHAR(256) NOT NULL,
ADD COLUMN     "name" VARCHAR(256) NOT NULL,
ADD COLUMN     "vacancies" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."class";

-- CreateTable
CREATE TABLE "public"."lessons" (
    "id" VARCHAR(256) NOT NULL,
    "theme" VARCHAR(256) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "class_id" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(256) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "courses_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."class_days" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."lessons" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."lessons" ADD CONSTRAINT "lessons_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lessons" ADD CONSTRAINT "lessons_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presence_lists" ADD CONSTRAINT "lessons_fk" FOREIGN KEY ("classe_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
