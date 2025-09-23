/*
  Warnings:

  - You are about to drop the column `companiesId` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `StripeCompanyCustomer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripeCompanySubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripePrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripeProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."stripe_pricing_type" AS ENUM ('one_time', 'recurring');

-- CreateEnum
CREATE TYPE "public"."stripe_pricing_plan_interval" AS ENUM ('day', 'week', 'month', 'year');

-- CreateEnum
CREATE TYPE "public"."stripe_subscription_status" AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');

-- DropForeignKey
ALTER TABLE "public"."StripeCompanyCustomer" DROP CONSTRAINT "StripeCompanyCustomer_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StripeCompanySubscription" DROP CONSTRAINT "StripeCompanySubscription_company_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StripeCompanySubscription" DROP CONSTRAINT "StripeCompanySubscription_price_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StripePrice" DROP CONSTRAINT "StripePrice_product_id_fkey";

-- AlterTable
ALTER TABLE "public"."courses" DROP COLUMN "companiesId";

-- DropTable
DROP TABLE "public"."StripeCompanyCustomer";

-- DropTable
DROP TABLE "public"."StripeCompanySubscription";

-- DropTable
DROP TABLE "public"."StripePrice";

-- DropTable
DROP TABLE "public"."StripeProduct";

-- DropEnum
DROP TYPE "public"."StripePricingPlanInterval";

-- DropEnum
DROP TYPE "public"."StripePricingType";

-- DropEnum
DROP TYPE "public"."StripeSubscriptionStatus";

-- CreateTable
CREATE TABLE "public"."stripe_products" (
    "id" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(1024),
    "image" VARCHAR(1024),
    "metadata" JSONB,

    CONSTRAINT "stripe_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stripe_price" (
    "id" VARCHAR(256) NOT NULL,
    "product_id" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "description" VARCHAR(256),
    "unit_amount" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "type" "public"."stripe_pricing_type" NOT NULL,
    "interval" "public"."stripe_pricing_plan_interval",
    "interval_count" INTEGER,
    "trial_period_days" INTEGER,
    "metadata" JSONB,

    CONSTRAINT "stripe_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stripe_company_customer" (
    "company_id" VARCHAR(256) NOT NULL,
    "stripe_customer_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "stripe_company_customer_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "public"."stripe_company_subscription" (
    "id" VARCHAR(256) NOT NULL,
    "company_customer_id" VARCHAR(256) NOT NULL,
    "status" "public"."stripe_subscription_status" NOT NULL,
    "metadata" JSONB,
    "price_id" VARCHAR(256) NOT NULL,
    "quantity" INTEGER,
    "cancel_at_period_end" BOOLEAN,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_period_start" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "current_period_end" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "cancel_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "trial_start" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),

    CONSTRAINT "stripe_company_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_company_subscription_company_customer_id_key" ON "public"."stripe_company_subscription"("company_customer_id");

-- AddForeignKey
ALTER TABLE "public"."stripe_price" ADD CONSTRAINT "stripe_price_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."stripe_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."stripe_company_customer" ADD CONSTRAINT "stripe_company_customer_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."stripe_company_subscription" ADD CONSTRAINT "stripe_company_subscription_company_customer_id_fkey" FOREIGN KEY ("company_customer_id") REFERENCES "public"."stripe_company_customer"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."stripe_company_subscription" ADD CONSTRAINT "stripe_company_subscription_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."stripe_price"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
