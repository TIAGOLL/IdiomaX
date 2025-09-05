/*
  Warnings:

  - You are about to drop the column `estate_registration` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "estate_registration",
ADD COLUMN     "state_registration" VARCHAR(256);

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "public"."companies"("cnpj");
