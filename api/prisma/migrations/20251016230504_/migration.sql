/*
  Warnings:

  - You are about to drop the `tasks_deliveries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey (se existir)
ALTER TABLE "public"."registrations" DROP CONSTRAINT IF EXISTS "courses_fk";

-- DropForeignKey
ALTER TABLE "public"."tasks_deliveries" DROP CONSTRAINT "tasks_deliveries_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_deliveries" DROP CONSTRAINT "tasks_deliveries_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_deliveries" DROP CONSTRAINT "tasks_deliveries_task_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks_deliveries" DROP CONSTRAINT "tasks_deliveries_updated_by_fkey";

-- AlterTable
ALTER TABLE "public"."registrations" ADD COLUMN     "coursesId" VARCHAR(256);

-- DropTable
DROP TABLE "public"."tasks_deliveries";

-- CreateTable
CREATE TABLE "public"."tasks_submitted" (
    "id" VARCHAR(256) NOT NULL,
    "task_id" VARCHAR(256) NOT NULL,
    "registration_id" VARCHAR(256) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file" BYTEA,
    "link" VARCHAR(512),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(256) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tasks_submitted_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "registrations_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "public"."courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks_submitted" ADD CONSTRAINT "tasks_submitted_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks_submitted" ADD CONSTRAINT "tasks_submitted_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks_submitted" ADD CONSTRAINT "tasks_submitted_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks_submitted" ADD CONSTRAINT "tasks_submitted_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
