/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id,company_id]` on the table `StripeCompanyCustomer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StripeCompanyCustomer_stripe_customer_id_company_id_key" ON "public"."StripeCompanyCustomer"("stripe_customer_id", "company_id");
