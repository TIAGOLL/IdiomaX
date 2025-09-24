/*
  Warnings:

  - A unique constraint covering the columns `[companies_id]` on the table `configs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "configs_companies_id_key" ON "public"."configs"("companies_id");
