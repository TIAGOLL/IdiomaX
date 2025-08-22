-- CreateTable
CREATE TABLE "public"."adresses" (
    "id" SERIAL NOT NULL,
    "street" TEXT,
    "zip_code" TEXT,
    "district" TEXT,
    "complement" TEXT,
    "city" TEXT,
    "state" TEXT,
    "number" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "adresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth" (
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Bearer',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "refresh_token" TEXT NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "public"."boleto_api" (
    "id" SERIAL NOT NULL,
    "developer_application_key" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL,

    CONSTRAINT "boleto_api_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."books" (
    "id" SERIAL NOT NULL,
    "courses_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classes" (
    "id" SERIAL NOT NULL,
    "theme" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "professionals_id" INTEGER NOT NULL,
    "classrooms_id" INTEGER NOT NULL,
    "presence_list_id" INTEGER NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classrooms" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "books_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."configs" (
    "id" SERIAL NOT NULL,
    "registrations_time" INTEGER DEFAULT 6,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lessons" (
    "id" SERIAL NOT NULL,
    "books_id" INTEGER NOT NULL,
    "name" TEXT,
    "url" TEXT,
    "position" INTEGER,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monthly_fee" (
    "id" SERIAL NOT NULL,
    "registrations_id" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3),
    "amount_to_be_paid" DOUBLE PRECISION,
    "amount_paid" DOUBLE PRECISION DEFAULT 0,
    "date_of_paid" TIMESTAMP(3),
    "payment_method" TEXT,
    "paid" BOOLEAN DEFAULT false,

    CONSTRAINT "monthly_fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permissions" (
    "id" SERIAL NOT NULL,
    "create_classes" BOOLEAN DEFAULT false,
    "update_classes" BOOLEAN DEFAULT false,
    "delete_classes" BOOLEAN DEFAULT false,
    "update_students" BOOLEAN DEFAULT false,
    "delete_students" BOOLEAN,
    "create_students" BOOLEAN DEFAULT false,
    "update_professionals" BOOLEAN DEFAULT false,
    "create_professionals" BOOLEAN DEFAULT false,
    "delete_professionals" BOOLEAN DEFAULT false,
    "create_registrations" BOOLEAN DEFAULT false,
    "update_registrations" BOOLEAN DEFAULT false,
    "delete_registrations" BOOLEAN DEFAULT false,
    "dashboard" BOOLEAN DEFAULT false,
    "create_courses" BOOLEAN DEFAULT false,
    "update_courses" BOOLEAN DEFAULT false,
    "delete_courses" BOOLEAN DEFAULT false,
    "create_classrooms" BOOLEAN DEFAULT false,
    "update_classrooms" BOOLEAN DEFAULT false,
    "delete_classrooms" BOOLEAN DEFAULT false,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."presence_list" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "is_present" BOOLEAN DEFAULT false,
    "time_arrived" TIMESTAMP(3),

    CONSTRAINT "presence_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."professionals" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "adresses_id" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "admin" BOOLEAN NOT NULL DEFAULT true,
    "avatar_url" TEXT,
    "password" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "hour_value" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."records_of_students" (
    "id" SERIAL NOT NULL,
    "students_id" INTEGER NOT NULL,
    "description" TEXT,
    "title" TEXT,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "records_of_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."registrations" (
    "id" SERIAL NOT NULL,
    "students_id" INTEGER NOT NULL,
    "courses_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "monthly_fee_amount" DOUBLE PRECISION DEFAULT 0,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "locked" BOOLEAN DEFAULT false,
    "completed" BOOLEAN DEFAULT false,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."role" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" SERIAL NOT NULL,
    "adresses_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "avatar_url" TEXT,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students_has_classrooms" (
    "id" SERIAL NOT NULL,
    "registrations_id" INTEGER NOT NULL,
    "classrooms_id" INTEGER NOT NULL,

    CONSTRAINT "students_has_classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "scores_id" INTEGER NOT NULL,
    "registrations_id" INTEGER NOT NULL,
    "lessons_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response" TEXT,
    "score_obtained" DOUBLE PRECISION,
    "question" TEXT,
    "total_score" DOUBLE PRECISION,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("scores_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_token_key" ON "public"."auth"("token");

-- CreateIndex
CREATE INDEX "books_courses_id_idx" ON "public"."books"("courses_id");

-- CreateIndex
CREATE INDEX "classes_classrooms_id_idx" ON "public"."classes"("classrooms_id");

-- CreateIndex
CREATE INDEX "classes_presence_list_id_idx" ON "public"."classes"("presence_list_id");

-- CreateIndex
CREATE INDEX "classes_professionals_id_idx" ON "public"."classes"("professionals_id");

-- CreateIndex
CREATE INDEX "classrooms_books_id_idx" ON "public"."classrooms"("books_id");

-- CreateIndex
CREATE INDEX "lessons_books_id_idx" ON "public"."lessons"("books_id");

-- CreateIndex
CREATE INDEX "monthly_fee_registrations_id_idx" ON "public"."monthly_fee"("registrations_id");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_cpf_key" ON "public"."professionals"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_email_key" ON "public"."professionals"("email");

-- CreateIndex
CREATE INDEX "professionals_adresses_id_idx" ON "public"."professionals"("adresses_id");

-- CreateIndex
CREATE INDEX "professionals_role_id_idx" ON "public"."professionals"("role_id");

-- CreateIndex
CREATE INDEX "records_of_students_students_id_idx" ON "public"."records_of_students"("students_id");

-- CreateIndex
CREATE INDEX "registrations_courses_id_idx" ON "public"."registrations"("courses_id");

-- CreateIndex
CREATE INDEX "registrations_students_id_idx" ON "public"."registrations"("students_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "public"."students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_key" ON "public"."students"("user");

-- CreateIndex
CREATE INDEX "students_adresses_id_idx" ON "public"."students"("adresses_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_has_classrooms_registrations_id_key" ON "public"."students_has_classrooms"("registrations_id");

-- CreateIndex
CREATE INDEX "students_has_classrooms_classrooms_id_idx" ON "public"."students_has_classrooms"("classrooms_id");

-- CreateIndex
CREATE INDEX "students_has_classrooms_registrations_id_idx" ON "public"."students_has_classrooms"("registrations_id");

-- CreateIndex
CREATE INDEX "tasks_lessons_id_idx" ON "public"."tasks"("lessons_id");

-- CreateIndex
CREATE INDEX "tasks_registrations_id_idx" ON "public"."tasks"("registrations_id");

-- AddForeignKey
ALTER TABLE "public"."books" ADD CONSTRAINT "books_courses_id_fkey" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_classrooms_id_fkey" FOREIGN KEY ("classrooms_id") REFERENCES "public"."classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_presence_list_id_fkey" FOREIGN KEY ("presence_list_id") REFERENCES "public"."presence_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_professionals_id_fkey" FOREIGN KEY ("professionals_id") REFERENCES "public"."professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classrooms" ADD CONSTRAINT "classrooms_books_id_fkey" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lessons" ADD CONSTRAINT "lessons_books_id_fkey" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monthly_fee" ADD CONSTRAINT "monthly_fee_registrations_id_fkey" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_adresses_id_fkey" FOREIGN KEY ("adresses_id") REFERENCES "public"."adresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."professionals" ADD CONSTRAINT "professionals_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."records_of_students" ADD CONSTRAINT "records_of_students_students_id_fkey" FOREIGN KEY ("students_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "registrations_courses_id_fkey" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registrations" ADD CONSTRAINT "registrations_students_id_fkey" FOREIGN KEY ("students_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_adresses_id_fkey" FOREIGN KEY ("adresses_id") REFERENCES "public"."adresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students_has_classrooms" ADD CONSTRAINT "students_has_classrooms_classrooms_id_fkey" FOREIGN KEY ("classrooms_id") REFERENCES "public"."classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students_has_classrooms" ADD CONSTRAINT "students_has_classrooms_registrations_id_fkey" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_lessons_id_fkey" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_registrations_id_fkey" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
