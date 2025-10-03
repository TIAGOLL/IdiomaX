/*
  Warnings:

  - Added the required column `end_time` to the `class_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `class_days` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."class_days" ADD COLUMN     "end_time" TIME(3) NOT NULL,
ADD COLUMN     "start_time" TIME(3) NOT NULL;
