/*
  Warnings:

  - A unique constraint covering the columns `[company_customer_id]` on the table `StripeCompanySubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."companies_email_key";

-- AlterTable
ALTER TABLE "public"."StripeCompanySubscription" ALTER COLUMN "current_period_start" DROP NOT NULL,
ALTER COLUMN "current_period_end" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StripeCompanySubscription_company_customer_id_key" ON "public"."StripeCompanySubscription"("company_customer_id");
