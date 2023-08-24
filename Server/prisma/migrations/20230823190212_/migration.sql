/*
  Warnings:

  - You are about to drop the column `address_id` on the `supplier` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "supplier_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_supplier" ("company_id", "email", "id", "name") SELECT "company_id", "email", "id", "name" FROM "supplier";
DROP TABLE "supplier";
ALTER TABLE "new_supplier" RENAME TO "supplier";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
