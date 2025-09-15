/*
  Warnings:

  - You are about to drop the column `logo_16x16` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `logo_512x512` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "logo_16x16",
DROP COLUMN "logo_512x512",
ADD COLUMN     "logo_16x16_url" VARCHAR(1024),
ADD COLUMN     "logo_512x512_url" VARCHAR(1024);
