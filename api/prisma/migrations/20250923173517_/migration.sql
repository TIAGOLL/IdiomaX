/*
  Warnings:

  - You are about to drop the `monthly_fee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `presence_list` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_company_customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_company_subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks_delivery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."monthly_fee" DROP CONSTRAINT "monthly_fee_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."monthly_fee" DROP CONSTRAINT "monthly_fee_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."monthly_fee" DROP CONSTRAINT "registrations_fk";

-- DropForeignKey
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "classes_fk";

-- DropForeignKey
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "presence_list_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "presence_list_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."presence_list" DROP CONSTRAINT "users_fk";

-- DropForeignKey
ALTER TABLE "public"."stripe_company_customer" DROP CONSTRAINT "stripe_company_customer_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."stripe_company_subscription" DROP CONSTRAINT "stripe_company_subscription_company_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."stripe_company_subscription" DROP CONSTRAINT "stripe_company_subscription_price_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."stripe_price" DROP CONSTRAINT "stripe_price_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_delivery" DROP CONSTRAINT "tasks_delivery_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_delivery" DROP CONSTRAINT "tasks_delivery_registrations_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_delivery" DROP CONSTRAINT "tasks_delivery_tasks_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_delivery" DROP CONSTRAINT "tasks_delivery_updated_by_fkey";

-- DropTable
DROP TABLE "public"."monthly_fee";

-- DropTable
DROP TABLE "public"."presence_list";

-- DropTable
DROP TABLE "public"."stripe_company_customer";

-- DropTable
DROP TABLE "public"."stripe_company_subscription";

-- DropTable
DROP TABLE "public"."stripe_price";

-- DropTable
DROP TABLE "public"."tasks_delivery";

-- CreateTable
CREATE TABLE "public"."monthly_fees" (
    "id" VARCHAR(256) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "discount_payment_before_due_date" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "registrations_id" VARCHAR(256) NOT NULL,
    "payment_method" VARCHAR(256),
    "date_of_payment" TIMESTAMPTZ(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(256) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "registrationsId" VARCHAR(256),

    CONSTRAINT "monthly_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."presence_lists" (
    "id" TEXT NOT NULL,
    "is_present" BOOLEAN NOT NULL,
    "users_id" TEXT NOT NULL,
    "classes_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(256) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "presence_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks_deliveries" (
    "id" VARCHAR(256) NOT NULL,
    "tasks_id" VARCHAR(256) NOT NULL,
    "registrations_id" VARCHAR(256) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file" BYTEA,
    "link" VARCHAR(512),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(256) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tasks_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stripe_prices" (
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

    CONSTRAINT "stripe_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stripe_company_customers" (
    "company_id" VARCHAR(256) NOT NULL,
    "stripe_customer_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "stripe_company_customers_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "public"."stripe_company_subscriptions" (
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

    CONSTRAINT "stripe_company_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "presence_lists_users_id_classes_id_key" ON "public"."presence_lists"("users_id", "classes_id");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_company_subscriptions_company_customer_id_key" ON "public"."stripe_company_subscriptions"("company_customer_id");

-- AddForeignKey
ALTER TABLE "public"."monthly_fees" ADD CONSTRAINT "registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."monthly_fees" ADD CONSTRAINT "monthly_fees_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monthly_fees" ADD CONSTRAINT "monthly_fees_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presence_lists" ADD CONSTRAINT "classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."presence_lists" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."presence_lists" ADD CONSTRAINT "presence_lists_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presence_lists" ADD CONSTRAINT "presence_lists_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks_deliveries" ADD CONSTRAINT "tasks_deliveries_registrations_id_fkey" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks_deliveries" ADD CONSTRAINT "tasks_deliveries_tasks_id_fkey" FOREIGN KEY ("tasks_id") REFERENCES "public"."tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks_deliveries" ADD CONSTRAINT "tasks_deliveries_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks_deliveries" ADD CONSTRAINT "tasks_deliveries_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stripe_prices" ADD CONSTRAINT "stripe_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."stripe_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."stripe_company_customers" ADD CONSTRAINT "stripe_company_customers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."stripe_company_subscriptions" ADD CONSTRAINT "stripe_company_subscriptions_company_customer_id_fkey" FOREIGN KEY ("company_customer_id") REFERENCES "public"."stripe_company_customers"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."stripe_company_subscriptions" ADD CONSTRAINT "stripe_company_subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."stripe_prices"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
