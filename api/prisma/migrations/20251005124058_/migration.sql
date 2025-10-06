-- AlterTable
ALTER TABLE "public"."registrations" ADD COLUMN     "discount_payment_before_due_date" DECIMAL(10,2) NOT NULL DEFAULT 0;
