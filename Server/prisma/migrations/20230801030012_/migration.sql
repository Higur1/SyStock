/*
  Warnings:

  - You are about to drop the column `email` on the `company` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "status_company_id" INTEGER NOT NULL,
    "subscription_plans" INTEGER NOT NULL,
    CONSTRAINT "company_status_company_id_fkey" FOREIGN KEY ("status_company_id") REFERENCES "status_company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "company_subscription_plans_fkey" FOREIGN KEY ("subscription_plans") REFERENCES "subscription_plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_company" ("cnpj", "id", "name", "status_company_id", "subscription_plans") SELECT "cnpj", "id", "name", "status_company_id", "subscription_plans" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE UNIQUE INDEX "company_name_key" ON "company"("name");
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
