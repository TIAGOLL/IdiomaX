/*
  Warnings:

  - You are about to drop the column `classe_id` on the `presence_lists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,lesson_id]` on the table `presence_lists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lesson_id` to the `presence_lists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."presence_lists" DROP CONSTRAINT "lessons_fk";

-- DropIndex
DROP INDEX "public"."presence_lists_user_id_classe_id_key";

-- AlterTable
ALTER TABLE "public"."presence_lists" DROP COLUMN "classe_id",
ADD COLUMN     "lesson_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "presence_lists_user_id_lesson_id_key" ON "public"."presence_lists"("user_id", "lesson_id");

-- AddForeignKey
ALTER TABLE "public"."presence_lists" ADD CONSTRAINT "lessons_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
