/*
  Warnings:

  - A unique constraint covering the columns `[class_id,user_id]` on the table `users_in_class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_in_class_class_id_user_id_key" ON "public"."users_in_class"("class_id", "user_id");
