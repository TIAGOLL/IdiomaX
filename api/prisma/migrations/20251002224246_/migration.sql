/*
  Warnings:

  - The values [TERCA] on the enum `WeekDays` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."WeekDays_new" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');
ALTER TABLE "public"."class_days" ALTER COLUMN "week_date" TYPE "public"."WeekDays_new" USING ("week_date"::text::"public"."WeekDays_new");
ALTER TYPE "public"."WeekDays" RENAME TO "WeekDays_old";
ALTER TYPE "public"."WeekDays_new" RENAME TO "WeekDays";
DROP TYPE "public"."WeekDays_old";
COMMIT;
