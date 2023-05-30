/*
  Warnings:

  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier_address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `state_registration` on the `suppliers` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "address_customer_id_key";

-- DropIndex
DROP INDEX "customers_email_key";

-- DropIndex
DROP INDEX "customers_cpfCnpj_key";

-- DropIndex
DROP INDEX "supplier_address_supplier_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "address";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "customers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "stock";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "supplier_address";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "state_registration" TEXT NOT NULL,
    "company_address" INTEGER NOT NULL,
    CONSTRAINT "company_company_address_fkey" FOREIGN KEY ("company_address") REFERENCES "company_address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "complement" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "company_phone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    CONSTRAINT "company_phone_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "supplier_phone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    CONSTRAINT "supplier_phone_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    CONSTRAINT "batch_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "batch_product" (
    "number_batch" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("number_batch", "product_id"),
    CONSTRAINT "batch_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_product_number_batch_fkey" FOREIGN KEY ("number_batch") REFERENCES "batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "ncmSh" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("category_id", "description", "id", "ncmSh", "price") SELECT "category_id", "description", "id", "ncmSh", "price" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE TABLE "new_suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    CONSTRAINT "suppliers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_suppliers" ("email", "id") SELECT "email", "id" FROM "suppliers";
DROP TABLE "suppliers";
ALTER TABLE "new_suppliers" RENAME TO "suppliers";
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "company_address_number_key" ON "company_address"("number");

-- CreateIndex
CREATE UNIQUE INDEX "company_phone_phone_key" ON "company_phone"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_phone_phone_key" ON "supplier_phone"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "batch_number_key" ON "batch"("number");
