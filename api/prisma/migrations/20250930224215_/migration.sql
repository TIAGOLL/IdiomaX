/*
  Warnings:

  - You are about to alter the column `vacancies` on the `class` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Integer`.
  - You are about to alter the column `registration_time` on the `configs` table. The data in that column could be lost. The data in that column will be cast from `Decimal(256,0)` to `Integer`.
  - You are about to alter the column `minimum_grade` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,0)` to `Integer`.
  - You are about to alter the column `maximum_grade` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,0)` to `Integer`.
  - You are about to alter the column `minimum_frequency` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,0)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."class" ALTER COLUMN "vacancies" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."classrooms" ALTER COLUMN "number" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."configs" ALTER COLUMN "registration_time" SET DEFAULT 6,
ALTER COLUMN "registration_time" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."courses" ALTER COLUMN "workload" SET DATA TYPE INTEGER,
ALTER COLUMN "minimum_grade" SET DATA TYPE INTEGER,
ALTER COLUMN "maximum_grade" SET DATA TYPE INTEGER,
ALTER COLUMN "minimum_frequency" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."levels" ALTER COLUMN "level" SET DATA TYPE INTEGER;
