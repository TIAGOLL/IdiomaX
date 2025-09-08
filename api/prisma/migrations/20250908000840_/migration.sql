-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "role_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
