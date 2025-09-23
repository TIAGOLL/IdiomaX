/*
  Warnings:

  - Made the column `created_by` on table `class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `class_days` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `class_days` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `classes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `classrooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `classrooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `companies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `companies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `configs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `configs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `disciplines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `disciplines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `levels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `levels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `materials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `materials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `members` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `members` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `monthly_fee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `monthly_fee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `presence_list` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `presence_list` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `records_of_students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `records_of_students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `registrations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `registrations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `tasks_delivery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `tasks_delivery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `users_in_class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `users_in_class` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."class" DROP CONSTRAINT "class_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."class" DROP CONSTRAINT "class_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."class_days" DROP CONSTRAINT "class_days_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."class_days" DROP CONSTRAINT "class_days_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."classes" DROP CONSTRAINT "classes_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."classes" DROP CONSTRAINT "classes_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."classrooms" DROP CONSTRAINT "classrooms_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."classrooms" DROP CONSTRAINT "classrooms_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."companies" DROP CONSTRAINT "companies_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."companies" DROP CONSTRAINT "companies_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."configs" DROP CONSTRAINT "configs_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."configs" DROP CONSTRAINT "configs_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."courses" DROP CONSTRAINT "courses_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."courses" DROP CONSTRAINT "courses_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."disciplines" DROP CONSTRAINT "disciplines_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."disciplines" DROP CONSTRAINT "disciplines_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."levels" DROP CONSTRAINT "levels_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."levels" DROP CONSTRAINT "levels_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."materials" DROP CONSTRAINT "materials_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."materials" DROP CONSTRAINT "materials_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."members" DROP CONSTRAINT "members_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."members" DROP CONSTRAINT "members_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."monthly_fee" DROP CONSTRAINT "monthly_fee_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."monthly_fee" DROP CONSTRAINT "monthly_fee_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "presence_list_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "presence_list_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."records_of_students" DROP CONSTRAINT "records_of_students_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."records_of_students" DROP CONSTRAINT "records_of_students_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."registrations" DROP CONSTRAINT "registrations_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."registrations" DROP CONSTRAINT "registrations_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_delivery" DROP CONSTRAINT "tasks_delivery_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_delivery" DROP CONSTRAINT "tasks_delivery_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tokens" DROP CONSTRAINT "tokens_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tokens" DROP CONSTRAINT "tokens_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."users_in_class" DROP CONSTRAINT "users_in_class_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."users_in_class" DROP CONSTRAINT "users_in_class_updated_by_fkey";

-- AlterTable
ALTER TABLE "public"."class" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."class_days" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."classes" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."classrooms" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."companies" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."configs" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."courses" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."disciplines" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."levels" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."materials" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."members" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."monthly_fee" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."presence_list" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."records_of_students" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."registrations" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."tasks" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."tasks_delivery" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."tokens" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."users_in_class" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."class" ADD CONSTRAINT "class_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class" ADD CONSTRAINT "class_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class_days" ADD CONSTRAINT "class_days_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class_days" ADD CONSTRAINT "class_days_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classrooms" ADD CONSTRAINT "classrooms_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classrooms" ADD CONSTRAINT "classrooms_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."configs" ADD CONSTRAINT "configs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."configs" ADD CONSTRAINT "configs_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."disciplines" ADD CONSTRAINT "disciplines_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."disciplines" ADD CONSTRAINT "disciplines_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."levels" ADD CONSTRAINT "levels_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."levels" ADD CONSTRAINT "levels_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."materials" ADD CONSTRAINT "materials_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."materials" ADD CONSTRAINT "materials_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monthly_fee" ADD CONSTRAINT "monthly_fee_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monthly_fee" ADD CONSTRAINT "monthly_fee_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presence_list" ADD CONSTRAINT "presence_list_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presence_list" ADD CONSTRAINT "presence_list_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."records_of_students" ADD CONSTRAINT "records_of_students_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."records_of_students" ADD CONSTRAINT "records_of_students_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "registrations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "registrations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks_delivery" ADD CONSTRAINT "tasks_delivery_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks_delivery" ADD CONSTRAINT "tasks_delivery_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tokens" ADD CONSTRAINT "tokens_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tokens" ADD CONSTRAINT "tokens_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."members" ADD CONSTRAINT "members_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."members" ADD CONSTRAINT "members_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "users_in_class_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "users_in_class_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
