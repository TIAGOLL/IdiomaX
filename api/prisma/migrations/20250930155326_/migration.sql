/*
  Warnings:

  - You are about to drop the column `nome` on the `class` table. All the data in the column will be lost.
  - Added the required column `name` to the `class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."class" DROP COLUMN "nome",
ADD COLUMN     "name" VARCHAR(256) NOT NULL;
