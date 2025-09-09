/*
  Warnings:

  - You are about to drop the column `companiesId` on the `classrooms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."users_in_class" DROP CONSTRAINT "users_fk";

-- AlterTable
ALTER TABLE "public"."classrooms" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "public"."tasks_delivery" ADD COLUMN     "users_id" VARCHAR(256);

-- AddForeignKey
ALTER TABLE "public"."tasks_delivery" ADD CONSTRAINT "tasks_delivery_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "users_in_class_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
