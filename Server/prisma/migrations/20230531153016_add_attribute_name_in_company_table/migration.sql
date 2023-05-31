/*
  Warnings:

  - Added the required column `name` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "state_registration" TEXT NOT NULL
);
INSERT INTO "new_company" ("cnpj", "email", "id", "state_registration") SELECT "cnpj", "email", "id", "state_registration" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE UNIQUE INDEX "company_name_key" ON "company"("name");
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
