/*
  Warnings:

  - You are about to drop the column `company_address` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `suppliers` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company_address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "complement" TEXT NOT NULL,
    CONSTRAINT "company_address_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_company_address" ("cep", "city", "company_id", "complement", "id", "number", "state", "street") SELECT "cep", "city", "company_id", "complement", "id", "number", "state", "street" FROM "company_address";
DROP TABLE "company_address";
ALTER TABLE "new_company_address" RENAME TO "company_address";
CREATE UNIQUE INDEX "company_address_number_key" ON "company_address"("number");
CREATE TABLE "new_company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "state_registration" TEXT NOT NULL
);
INSERT INTO "new_company" ("cnpj", "email", "id", "state_registration") SELECT "cnpj", "email", "id", "state_registration" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");
CREATE TABLE "new_suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    CONSTRAINT "suppliers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_suppliers" ("company_id", "email", "id") SELECT "company_id", "email", "id" FROM "suppliers";
DROP TABLE "suppliers";
ALTER TABLE "new_suppliers" RENAME TO "suppliers";
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
