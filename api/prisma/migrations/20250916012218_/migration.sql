/*
  Warnings:

  - The primary key for the `presence_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[users_id,classes_id]` on the table `presence_list` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "classes_fk";

-- DropForeignKey
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "users_fk";

-- DropIndex
DROP INDEX "public"."presence_list_classes_id_key";

-- DropIndex
DROP INDEX "public"."presence_list_users_id_key";

-- AlterTable
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "presence_list_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "is_present" DROP DEFAULT,
ALTER COLUMN "users_id" SET DATA TYPE TEXT,
ALTER COLUMN "classes_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "presence_list_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "presence_list_users_id_classes_id_key" ON "public"."presence_list"("users_id", "classes_id");

-- AddForeignKey
ALTER TABLE "public"."presence_list" ADD CONSTRAINT "classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."presence_list" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
