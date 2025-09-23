/*
  Warnings:

  - A unique constraint covering the columns `[company_id,user_id,role]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "members_company_id_user_id_role_key" ON "public"."members"("company_id", "user_id", "role");
