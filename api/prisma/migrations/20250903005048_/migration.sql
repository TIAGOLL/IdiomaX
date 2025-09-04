/*
  Warnings:

  - The primary key for the `classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classrooms_id` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `presence_list_id` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `professionals_id` on the `classes` table. All the data in the column will be lost.
  - You are about to alter the column `theme` on the `classes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - The primary key for the `classrooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `books_id` on the `classrooms` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `classrooms` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `classrooms` table. All the data in the column will be lost.
  - The primary key for the `configs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price` on the `courses` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - The primary key for the `monthly_fee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount_paid` on the `monthly_fee` table. All the data in the column will be lost.
  - You are about to drop the column `amount_to_be_paid` on the `monthly_fee` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_paid` on the `monthly_fee` table. All the data in the column will be lost.
  - You are about to alter the column `payment_method` on the `monthly_fee` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - The primary key for the `presence_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `presence_list` table. All the data in the column will be lost.
  - You are about to drop the column `time_arrived` on the `presence_list` table. All the data in the column will be lost.
  - The primary key for the `records_of_students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `records_of_students` table. All the data in the column will be lost.
  - You are about to drop the column `students_id` on the `records_of_students` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `records_of_students` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.
  - You are about to alter the column `title` on the `records_of_students` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - The primary key for the `registrations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courses_id` on the `registrations` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `registrations` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `registrations` table. All the data in the column will be lost.
  - You are about to drop the column `students_id` on the `registrations` table. All the data in the column will be lost.
  - You are about to alter the column `monthly_fee_amount` on the `registrations` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,2)`.
  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `lessons_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `registrations_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `score_obtained` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `scores_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `total_score` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `adresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boleto_api` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `professionals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students_has_classrooms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `classrooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companies_id` to the `configs` table without a default value. This is not possible if the table is not empty.
  - Made the column `registrations_time` on table `configs` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `companies_id` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximum_grade` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimum_frequency` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimum_grade` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthly_fee_value` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_value` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workload` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `monthly_fee` table without a default value. This is not possible if the table is not empty.
  - Made the column `due_date` on table `monthly_fee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paid` on table `monthly_fee` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `classes_id` to the `presence_list` table without a default value. This is not possible if the table is not empty.
  - Added the required column `users_id` to the `presence_list` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_present` on table `presence_list` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `registrations_id` to the `records_of_students` table without a default value. This is not possible if the table is not empty.
  - Made the column `monthly_fee_amount` on table `registrations` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `disciplines_id` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `tasks` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `title` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."books" DROP CONSTRAINT "books_courses_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."classes" DROP CONSTRAINT "classes_classrooms_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."classes" DROP CONSTRAINT "classes_presence_list_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."classes" DROP CONSTRAINT "classes_professionals_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."classrooms" DROP CONSTRAINT "classrooms_books_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."lessons" DROP CONSTRAINT "lessons_books_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."monthly_fee" DROP CONSTRAINT "monthly_fee_registrations_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."professionals" DROP CONSTRAINT "professionals_adresses_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."professionals" DROP CONSTRAINT "professionals_role_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."records_of_students" DROP CONSTRAINT "records_of_students_students_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."registrations" DROP CONSTRAINT "registrations_courses_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."registrations" DROP CONSTRAINT "registrations_students_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_adresses_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students_has_classrooms" DROP CONSTRAINT "students_has_classrooms_classrooms_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students_has_classrooms" DROP CONSTRAINT "students_has_classrooms_registrations_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_lessons_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_registrations_id_fkey";

-- DropIndex
DROP INDEX "public"."classes_classrooms_id_idx";

-- DropIndex
DROP INDEX "public"."classes_presence_list_id_idx";

-- DropIndex
DROP INDEX "public"."classes_professionals_id_idx";

-- DropIndex
DROP INDEX "public"."classrooms_books_id_idx";

-- DropIndex
DROP INDEX "public"."monthly_fee_registrations_id_idx";

-- DropIndex
DROP INDEX "public"."records_of_students_students_id_idx";

-- DropIndex
DROP INDEX "public"."registrations_courses_id_idx";

-- DropIndex
DROP INDEX "public"."registrations_students_id_idx";

-- DropIndex
DROP INDEX "public"."tasks_lessons_id_idx";

-- DropIndex
DROP INDEX "public"."tasks_registrations_id_idx";

-- AlterTable
ALTER TABLE "public"."classes" DROP CONSTRAINT "classes_pkey",
DROP COLUMN "classrooms_id",
DROP COLUMN "presence_list_id",
DROP COLUMN "professionals_id",
ADD COLUMN     "class_id" VARCHAR(256) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "theme" SET DATA TYPE VARCHAR(256),
ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "classes_id_seq";

-- AlterTable
ALTER TABLE "public"."classrooms" DROP CONSTRAINT "classrooms_pkey",
DROP COLUMN "books_id",
DROP COLUMN "date",
DROP COLUMN "hour",
ADD COLUMN     "block" VARCHAR(256),
ADD COLUMN     "companiesId" TEXT,
ADD COLUMN     "companies_id" VARCHAR(256),
ADD COLUMN     "number" DECIMAL(5,0) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ADD CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "classrooms_id_seq";

-- AlterTable
ALTER TABLE "public"."configs" DROP CONSTRAINT "configs_pkey",
ADD COLUMN     "companiesId" TEXT,
ADD COLUMN     "companies_id" VARCHAR(256) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "registrations_time" SET NOT NULL,
ALTER COLUMN "registrations_time" SET DEFAULT 6,
ALTER COLUMN "registrations_time" SET DATA TYPE DECIMAL(256,0),
ADD CONSTRAINT "configs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "configs_id_seq";

-- AlterTable
ALTER TABLE "public"."courses" DROP CONSTRAINT "courses_pkey",
DROP COLUMN "price",
ADD COLUMN     "companiesId" TEXT,
ADD COLUMN     "companies_id" VARCHAR(256) NOT NULL,
ADD COLUMN     "description" VARCHAR(256),
ADD COLUMN     "maximum_grade" DECIMAL(20,0) NOT NULL,
ADD COLUMN     "minimum_frequency" DECIMAL(20,0) NOT NULL,
ADD COLUMN     "minimum_grade" DECIMAL(20,0) NOT NULL,
ADD COLUMN     "monthly_fee_value" DECIMAL(20,2) NOT NULL,
ADD COLUMN     "registration_value" DECIMAL(20,2) NOT NULL,
ADD COLUMN     "syllabus" BYTEA,
ADD COLUMN     "workload" DECIMAL(5,0) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(256),
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "courses_id_seq";

-- AlterTable
ALTER TABLE "public"."monthly_fee" DROP CONSTRAINT "monthly_fee_pkey",
DROP COLUMN "amount_paid",
DROP COLUMN "amount_to_be_paid",
DROP COLUMN "date_of_paid",
ADD COLUMN     "date_of_payment" TIMESTAMPTZ(3),
ADD COLUMN     "discount_payment_before_due_date" DECIMAL(3,2) NOT NULL DEFAULT 0,
ADD COLUMN     "registrationsId" VARCHAR(256),
ADD COLUMN     "value" DECIMAL(20,2) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "registrations_id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "due_date" SET NOT NULL,
ALTER COLUMN "payment_method" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "paid" SET NOT NULL,
ADD CONSTRAINT "monthly_fee_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "monthly_fee_id_seq";

-- AlterTable
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "presence_list_pkey",
DROP COLUMN "date",
DROP COLUMN "time_arrived",
ADD COLUMN     "classes_id" VARCHAR(256) NOT NULL,
ADD COLUMN     "users_id" VARCHAR(256) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "is_present" SET NOT NULL,
ADD CONSTRAINT "presence_list_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "presence_list_id_seq";

-- AlterTable
ALTER TABLE "public"."records_of_students" DROP CONSTRAINT "records_of_students_pkey",
DROP COLUMN "date",
DROP COLUMN "students_id",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "registrationsId" VARCHAR(256),
ADD COLUMN     "registrations_id" VARCHAR(256) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(512),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(256),
ADD CONSTRAINT "records_of_students_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "records_of_students_id_seq";

-- AlterTable
ALTER TABLE "public"."registrations" DROP CONSTRAINT "registrations_pkey",
DROP COLUMN "courses_id",
DROP COLUMN "created_by",
DROP COLUMN "end_date",
DROP COLUMN "students_id",
ADD COLUMN     "companiesId" TEXT,
ADD COLUMN     "companies_id" VARCHAR(256),
ADD COLUMN     "usersId" VARCHAR(256),
ADD COLUMN     "users_id" VARCHAR(256),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "monthly_fee_amount" SET NOT NULL,
ALTER COLUMN "monthly_fee_amount" SET DATA TYPE DECIMAL(20,2),
ADD CONSTRAINT "registrations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "registrations_id_seq";

-- AlterTable
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_pkey",
DROP COLUMN "date",
DROP COLUMN "lessons_id",
DROP COLUMN "question",
DROP COLUMN "registrations_id",
DROP COLUMN "response",
DROP COLUMN "score_obtained",
DROP COLUMN "scores_id",
DROP COLUMN "total_score",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR(1024),
ADD COLUMN     "disciplines_id" VARCHAR(256) NOT NULL,
ADD COLUMN     "due_date" TIME(3),
ADD COLUMN     "file" BYTEA,
ADD COLUMN     "id" VARCHAR(256) NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION,
ADD COLUMN     "title" VARCHAR(256) NOT NULL,
ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."adresses";

-- DropTable
DROP TABLE "public"."auth";

-- DropTable
DROP TABLE "public"."boleto_api";

-- DropTable
DROP TABLE "public"."books";

-- DropTable
DROP TABLE "public"."lessons";

-- DropTable
DROP TABLE "public"."permissions";

-- DropTable
DROP TABLE "public"."professionals";

-- DropTable
DROP TABLE "public"."role";

-- DropTable
DROP TABLE "public"."students";

-- DropTable
DROP TABLE "public"."students_has_classrooms";

-- CreateTable
CREATE TABLE "public"."class" (
    "id" VARCHAR(256) NOT NULL,
    "nome" VARCHAR(256) NOT NULL,
    "vacancies" DECIMAL(10,0) NOT NULL,
    "courses_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."class_days" (
    "id" VARCHAR(256) NOT NULL,
    "initial_date" TIMESTAMP(3) NOT NULL,
    "final_date" TIMESTAMP(3) NOT NULL,
    "class_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "class_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "users_id" VARCHAR(256) NOT NULL,
    "address" VARCHAR(256) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."disciplines" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "levels_id" VARCHAR(256) NOT NULL,
    "levelsId" VARCHAR(256),

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."levels" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "level" DECIMAL(5,0) NOT NULL,
    "courses_id" VARCHAR(256),
    "coursesId" VARCHAR(256),

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."materials" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "file" BYTEA NOT NULL,
    "levels_id" VARCHAR(256),
    "levelsId" VARCHAR(256),

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks_delivery" (
    "id" VARCHAR(256) NOT NULL,
    "tasks_id" VARCHAR(256) NOT NULL,
    "registrations_id" VARCHAR(256) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file" BYTEA,
    "link" VARCHAR(512),

    CONSTRAINT "tasks_delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tokens" (
    "id" VARCHAR(256) NOT NULL,
    "type" VARCHAR(256) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "users_id" VARCHAR(256) NOT NULL,
    "usersId" VARCHAR(256),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(1024) NOT NULL,
    "cpf" VARCHAR(256) NOT NULL,
    "phone" VARCHAR(256) NOT NULL,
    "username" VARCHAR(256) NOT NULL,
    "gender" VARCHAR(256) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address" VARCHAR(256) NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "avatar_url" VARCHAR(256),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users_in_class" (
    "id" VARCHAR(256) NOT NULL,
    "class_id" VARCHAR(256) NOT NULL,
    "users_id" VARCHAR(256) NOT NULL,
    "teacher" BOOLEAN NOT NULL,

    CONSTRAINT "users_in_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users_in_companies" (
    "id" VARCHAR(256) NOT NULL,
    "users_id" VARCHAR(256) NOT NULL,
    "role_id" VARCHAR(256) NOT NULL,
    "companies_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "users_in_companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- AddForeignKey
ALTER TABLE "public"."class" ADD CONSTRAINT "courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."class_days" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."classrooms" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."configs" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."disciplines" ADD CONSTRAINT "disciplines_levelsId_fkey" FOREIGN KEY ("levelsId") REFERENCES "public"."levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."levels" ADD CONSTRAINT "courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."materials" ADD CONSTRAINT "levels_fk" FOREIGN KEY ("levels_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."monthly_fee" ADD CONSTRAINT "registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."presence_list" ADD CONSTRAINT "classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."presence_list" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."records_of_students" ADD CONSTRAINT "registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "disciplines_fk" FOREIGN KEY ("disciplines_id") REFERENCES "public"."disciplines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks_delivery" ADD CONSTRAINT "tasks_delivery_registrations_id_fkey" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks_delivery" ADD CONSTRAINT "tasks_delivery_tasks_id_fkey" FOREIGN KEY ("tasks_id") REFERENCES "public"."tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tokens" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_in_companies" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_in_companies" ADD CONSTRAINT "roles_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_in_companies" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
