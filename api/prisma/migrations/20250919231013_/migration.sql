-- DropForeignKey
ALTER TABLE "public"."StripeCompanyCustomer" DROP CONSTRAINT "StripeCompanyCustomer_company_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."StripeCompanyCustomer" ADD CONSTRAINT "StripeCompanyCustomer_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
