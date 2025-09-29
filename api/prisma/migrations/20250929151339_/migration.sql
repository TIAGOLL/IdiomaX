/*
  Warnings:

  - A unique constraint covering the columns `[company_id,user_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."members_company_id_user_id_role_key";

-- CreateIndex
CREATE UNIQUE INDEX "members_company_id_user_id_key" ON "public"."members"("company_id", "user_id");
