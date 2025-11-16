/*
  Warnings:

  - Changed the type of `submit_date` on the `tasks` table from TIME to TIMESTAMP.
*/

-- Passo 1: Adicionar coluna temporária TIMESTAMP
ALTER TABLE "public"."tasks" ADD COLUMN "submit_date_temp" TIMESTAMP(3);

-- Passo 2: Converter TIME para TIMESTAMP usando data atual + hora existente
UPDATE "public"."tasks" 
SET "submit_date_temp" = (CURRENT_DATE + "submit_date"::TIME);

-- Passo 3: Tornar a coluna temporária NOT NULL
ALTER TABLE "public"."tasks" ALTER COLUMN "submit_date_temp" SET NOT NULL;

-- Passo 4: Remover coluna antiga
ALTER TABLE "public"."tasks" DROP COLUMN "submit_date";

-- Passo 5: Renomear coluna temporária
ALTER TABLE "public"."tasks" RENAME COLUMN "submit_date_temp" TO "submit_date";
