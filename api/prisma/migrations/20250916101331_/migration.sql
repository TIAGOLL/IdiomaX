/*
  Warnings:

  - A unique constraint covering the columns `[users_id]` on the table `presence_list` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[classes_id]` on the table `presence_list` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "presence_list_users_id_key" ON "public"."presence_list"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "presence_list_classes_id_key" ON "public"."presence_list"("classes_id");
