/*
  Warnings:

  - You are about to drop the `batch_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_phone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier_phone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `state_registration` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `batch` table. All the data in the column will be lost.
  - The primary key for the `token_recovery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tokenStatus` on the `token_recovery` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `token_recovery` table. All the data in the column will be lost.
  - Added the required column `address_id` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_id` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_company_id` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscription_plans` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createAt` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplyer_id` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `token_recovery` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "company_address_company_id_key";

-- DropIndex
DROP INDEX "company_phone_phone_key";

-- DropIndex
DROP INDEX "supplier_phone_phone_key";

-- DropIndex
DROP INDEX "suppliers_email_key";

-- DropIndex
DROP INDEX "suppliers_name_key";

-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_user_login_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "batch_product";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "categories";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "company_address";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "company_phone";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "products";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "supplier_phone";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "suppliers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_types";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "phone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cep" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "complement" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "status_company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'Active'
);

-- CreateTable
CREATE TABLE "subscription_plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'FREE',
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    CONSTRAINT "category_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL,
    "updateAt" DATETIME NOT NULL,
    "price" DECIMAL NOT NULL,
    CONSTRAINT "product_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "supplyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "phone_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "supplyer_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "supplyer_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "supplyer_phone_id_fkey" FOREIGN KEY ("phone_id") REFERENCES "phone" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'Common'
);

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" TEXT NOT NULL,
    "user_type_id" INTEGER NOT NULL,
    "user_login" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "user_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status_company_id" INTEGER NOT NULL,
    "subscription_plans" INTEGER NOT NULL,
    "phone_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    CONSTRAINT "company_status_company_id_fkey" FOREIGN KEY ("status_company_id") REFERENCES "status_company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "company_subscription_plans_fkey" FOREIGN KEY ("subscription_plans") REFERENCES "subscription_plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "company_phone_id_fkey" FOREIGN KEY ("phone_id") REFERENCES "phone" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "company_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_company" ("cnpj", "email", "id", "name") SELECT "cnpj", "email", "id", "name" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE UNIQUE INDEX "company_name_key" ON "company"("name");
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");
CREATE TABLE "new_batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "supplyer_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL,
    "updateAt" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_supplyer_id_fkey" FOREIGN KEY ("supplyer_id") REFERENCES "supplyer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_batch" ("id") SELECT "id" FROM "batch";
DROP TABLE "batch";
ALTER TABLE "new_batch" RENAME TO "batch";
CREATE TABLE "new_token_recovery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token_status" BOOLEAN NOT NULL DEFAULT true,
    "company_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "token_recovery_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "token_recovery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_token_recovery" ("id", "user_id") SELECT "id", "user_id" FROM "token_recovery";
DROP TABLE "token_recovery";
ALTER TABLE "new_token_recovery" RENAME TO "token_recovery";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
