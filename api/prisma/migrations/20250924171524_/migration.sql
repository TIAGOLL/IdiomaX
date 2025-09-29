/*
  Warnings:

  - A unique constraint covering the columns `[company_id]` on the table `configs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "configs_company_id_key" ON "public"."configs"("company_id");
