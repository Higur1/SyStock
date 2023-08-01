/*
  Warnings:

  - You are about to drop the column `address_id` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `phone_id` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `phone_id` on the `supplyer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cep" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "company_id" TEXT NOT NULL DEFAULT '',
    "supplyer_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "address_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "address_supplyer_id_fkey" FOREIGN KEY ("supplyer_id") REFERENCES "supplyer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_address" ("cep", "city", "complement", "district", "id", "number", "state", "street") SELECT "cep", "city", "complement", "district", "id", "number", "state", "street" FROM "address";
DROP TABLE "address";
ALTER TABLE "new_address" RENAME TO "address";
CREATE TABLE "new_company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status_company_id" INTEGER NOT NULL,
    "subscription_plans" INTEGER NOT NULL,
    CONSTRAINT "company_status_company_id_fkey" FOREIGN KEY ("status_company_id") REFERENCES "status_company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "company_subscription_plans_fkey" FOREIGN KEY ("subscription_plans") REFERENCES "subscription_plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_company" ("cnpj", "email", "id", "name", "status_company_id", "subscription_plans") SELECT "cnpj", "email", "id", "name", "status_company_id", "subscription_plans" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE UNIQUE INDEX "company_name_key" ON "company"("name");
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");
CREATE TABLE "new_phone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "company_id" TEXT NOT NULL DEFAULT '',
    "supplyer_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "phone_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "phone_supplyer_id_fkey" FOREIGN KEY ("supplyer_id") REFERENCES "supplyer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_phone" ("id", "phone") SELECT "id", "phone" FROM "phone";
DROP TABLE "phone";
ALTER TABLE "new_phone" RENAME TO "phone";
CREATE TABLE "new_supplyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "supplyer_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_supplyer" ("address_id", "company_id", "email", "id", "name") SELECT "address_id", "company_id", "email", "id", "name" FROM "supplyer";
DROP TABLE "supplyer";
ALTER TABLE "new_supplyer" RENAME TO "supplyer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
