/*
  Warnings:

  - You are about to alter the column `value` on the `monthly_fee` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "public"."monthly_fee" ALTER COLUMN "value" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discount_payment_before_due_date" SET DATA TYPE DECIMAL(10,2);
