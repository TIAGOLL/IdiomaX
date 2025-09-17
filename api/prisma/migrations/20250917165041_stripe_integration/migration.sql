-- CreateEnum
CREATE TYPE "public"."StripePricingType" AS ENUM ('one_time', 'recurring');

-- CreateEnum
CREATE TYPE "public"."StripePricingPlanInterval" AS ENUM ('day', 'week', 'month', 'year');

-- CreateEnum
CREATE TYPE "public"."StripeSubscriptionStatus" AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');

-- CreateTable
CREATE TABLE "public"."StripeProduct" (
    "id" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(1024),
    "image" VARCHAR(1024),
    "metadata" JSONB,

    CONSTRAINT "StripeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StripePrice" (
    "id" VARCHAR(256) NOT NULL,
    "product_id" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "description" VARCHAR(256),
    "unit_amount" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "type" "public"."StripePricingType" NOT NULL,
    "interval" "public"."StripePricingPlanInterval",
    "interval_count" INTEGER,
    "trial_period_days" INTEGER,
    "metadata" JSONB,

    CONSTRAINT "StripePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StripeCompanyCustomer" (
    "company_id" VARCHAR(256) NOT NULL,
    "stripe_customer_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "StripeCompanyCustomer_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "public"."StripeCompanySubscription" (
    "id" VARCHAR(256) NOT NULL,
    "company_customer_id" VARCHAR(256) NOT NULL,
    "status" "public"."StripeSubscriptionStatus" NOT NULL,
    "metadata" JSONB,
    "price_id" VARCHAR(256) NOT NULL,
    "quantity" INTEGER,
    "cancel_at_period_end" BOOLEAN,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_period_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_period_end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "cancel_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "trial_start" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),

    CONSTRAINT "StripeCompanySubscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."StripePrice" ADD CONSTRAINT "StripePrice_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."StripeProduct"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."StripeCompanyCustomer" ADD CONSTRAINT "StripeCompanyCustomer_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."StripeCompanySubscription" ADD CONSTRAINT "StripeCompanySubscription_company_customer_id_fkey" FOREIGN KEY ("company_customer_id") REFERENCES "public"."StripeCompanyCustomer"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."StripeCompanySubscription" ADD CONSTRAINT "StripeCompanySubscription_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."StripePrice"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
