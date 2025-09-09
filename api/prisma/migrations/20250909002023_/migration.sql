/*
  Warnings:

  - You are about to drop the column `users_id` on the `tasks_delivery` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."companies" DROP CONSTRAINT "companies_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_delivery" DROP CONSTRAINT "tasks_delivery_users_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users_in_class" DROP CONSTRAINT "users_in_class_users_id_fkey";

-- AlterTable
ALTER TABLE "public"."classrooms" ADD COLUMN     "companiesId" TEXT;

-- AlterTable
ALTER TABLE "public"."companies" ALTER COLUMN "owner_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."tasks_delivery" DROP COLUMN "users_id";

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
