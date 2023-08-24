/*
  Warnings:

  - You are about to drop the `supplyer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `supplyer_id` on the `phone` table. All the data in the column will be lost.
  - You are about to drop the column `supplyer_id` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `supplyer_id` on the `batch` table. All the data in the column will be lost.
  - Added the required column `supplier_id` to the `batch` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "supplyer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "supplier_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_phone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "company_id" TEXT NOT NULL DEFAULT '',
    "supplier_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "phone_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "phone_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_phone" ("company_id", "id", "phone") SELECT "company_id", "id", "phone" FROM "phone";
DROP TABLE "phone";
ALTER TABLE "new_phone" RENAME TO "phone";
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
    "supplier_id" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "address_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "address_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_address" ("cep", "city", "company_id", "complement", "district", "id", "number", "state", "street") SELECT "cep", "city", "company_id", "complement", "district", "id", "number", "state", "street" FROM "address";
DROP TABLE "address";
ALTER TABLE "new_address" RENAME TO "address";
CREATE TABLE "new_batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL,
    "updateAt" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_batch" ("company_id", "createAt", "id", "product_id", "quantity", "updateAt") SELECT "company_id", "createAt", "id", "product_id", "quantity", "updateAt" FROM "batch";
DROP TABLE "batch";
ALTER TABLE "new_batch" RENAME TO "batch";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
