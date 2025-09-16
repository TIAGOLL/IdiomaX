-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."class" (
    "id" VARCHAR(256) NOT NULL,
    "nome" VARCHAR(256) NOT NULL,
    "vacancies" DECIMAL(10,0) NOT NULL,
    "courses_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."class_days" (
    "id" VARCHAR(256) NOT NULL,
    "initial_date" TIMESTAMP(3) NOT NULL,
    "final_date" TIMESTAMP(3) NOT NULL,
    "class_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "class_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classes" (
    "id" VARCHAR(256) NOT NULL,
    "theme" VARCHAR(256) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "class_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classrooms" (
    "id" VARCHAR(256) NOT NULL,
    "number" DECIMAL(5,0) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "block" VARCHAR(256),
    "companies_id" VARCHAR(256),
    "companiesId" TEXT,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."configs" (
    "id" VARCHAR(256) NOT NULL,
    "registrations_time" DECIMAL(256,0) NOT NULL DEFAULT 6,
    "companies_id" VARCHAR(256) NOT NULL,
    "companiesId" TEXT,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" VARCHAR(256) NOT NULL,
    "description" VARCHAR(256),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(256) NOT NULL,
    "registration_value" DECIMAL(20,2) NOT NULL,
    "workload" DECIMAL(5,0) NOT NULL,
    "monthly_fee_value" DECIMAL(20,2) NOT NULL,
    "minimum_grade" DECIMAL(20,0) NOT NULL,
    "maximum_grade" DECIMAL(20,0) NOT NULL,
    "minimum_frequency" DECIMAL(20,0) NOT NULL,
    "syllabus" BYTEA,
    "companies_id" VARCHAR(256) NOT NULL,
    "companiesId" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."disciplines" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "levels_id" VARCHAR(256) NOT NULL,
    "levelsId" VARCHAR(256),

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."levels" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "level" DECIMAL(5,0) NOT NULL,
    "courses_id" VARCHAR(256),
    "coursesId" VARCHAR(256),

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."materials" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "file" BYTEA NOT NULL,
    "levels_id" VARCHAR(256),
    "levelsId" VARCHAR(256),

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monthly_fee" (
    "id" VARCHAR(256) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(20,2) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "discount_payment_before_due_date" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "registrations_id" VARCHAR(256) NOT NULL,
    "payment_method" VARCHAR(256),
    "date_of_payment" TIMESTAMPTZ(3),
    "registrationsId" VARCHAR(256),

    CONSTRAINT "monthly_fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."presence_list" (
    "id" VARCHAR(256) NOT NULL,
    "is_present" BOOLEAN NOT NULL DEFAULT false,
    "users_id" VARCHAR(256) NOT NULL,
    "classes_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "presence_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."records_of_students" (
    "id" VARCHAR(256) NOT NULL,
    "registrations_id" VARCHAR(256) NOT NULL,
    "description" VARCHAR(512),
    "title" VARCHAR(256),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "registrationsId" VARCHAR(256),

    CONSTRAINT "records_of_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."registrations" (
    "id" VARCHAR(256) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthly_fee_amount" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "locked" BOOLEAN DEFAULT false,
    "completed" BOOLEAN DEFAULT false,
    "users_id" VARCHAR(256),
    "companies_id" VARCHAR(256),
    "usersId" VARCHAR(256),
    "companiesId" TEXT,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file" BYTEA,
    "score" DOUBLE PRECISION,
    "description" VARCHAR(1024),
    "title" VARCHAR(256) NOT NULL,
    "disciplines_id" VARCHAR(256) NOT NULL,
    "due_date" TIME(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks_delivery" (
    "id" VARCHAR(256) NOT NULL,
    "tasks_id" VARCHAR(256) NOT NULL,
    "registrations_id" VARCHAR(256) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file" BYTEA,
    "link" VARCHAR(512),

    CONSTRAINT "tasks_delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tokens" (
    "id" VARCHAR(256) NOT NULL,
    "type" VARCHAR(256) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "users_id" VARCHAR(256) NOT NULL,
    "usersId" VARCHAR(256),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "cnpj" VARCHAR(256) NOT NULL,
    "phone" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "logo_16x16" VARCHAR(1024),
    "logo_512x512" VARCHAR(1024),
    "social_reason" VARCHAR(256),
    "state_registration" VARCHAR(256),
    "tax_regime" VARCHAR(256),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "address" VARCHAR(256) NOT NULL,
    "owner_id" VARCHAR(256) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(1024) NOT NULL,
    "cpf" VARCHAR(256) NOT NULL,
    "phone" VARCHAR(256) NOT NULL,
    "username" VARCHAR(256) NOT NULL,
    "gender" VARCHAR(256) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address" VARCHAR(256) NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "avatar_url" VARCHAR(1024),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."members" (
    "id" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users_in_class" (
    "id" VARCHAR(256) NOT NULL,
    "class_id" VARCHAR(256) NOT NULL,
    "users_id" VARCHAR(256) NOT NULL,
    "teacher" BOOLEAN NOT NULL,

    CONSTRAINT "users_in_class_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "public"."companies"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "public"."users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "members_company_id_user_id_key" ON "public"."members"("company_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."class" ADD CONSTRAINT "courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."class_days" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."classrooms" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."configs" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."disciplines" ADD CONSTRAINT "disciplines_levelsId_fkey" FOREIGN KEY ("levelsId") REFERENCES "public"."levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."levels" ADD CONSTRAINT "courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."materials" ADD CONSTRAINT "levels_fk" FOREIGN KEY ("levels_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."monthly_fee" ADD CONSTRAINT "registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."presence_list" ADD CONSTRAINT "classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."presence_list" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."records_of_students" ADD CONSTRAINT "registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "disciplines_fk" FOREIGN KEY ("disciplines_id") REFERENCES "public"."disciplines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks_delivery" ADD CONSTRAINT "tasks_delivery_registrations_id_fkey" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks_delivery" ADD CONSTRAINT "tasks_delivery_tasks_id_fkey" FOREIGN KEY ("tasks_id") REFERENCES "public"."tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tokens" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."members" ADD CONSTRAINT "members_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "class_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_in_class" ADD CONSTRAINT "users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
