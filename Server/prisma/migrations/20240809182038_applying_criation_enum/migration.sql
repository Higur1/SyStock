/*
  Warnings:

  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `phone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `status_company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `token_recovery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `company_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `user_login` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `user_password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `user_type_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `batch` table. All the data in the column will be lost.
  - The primary key for the `supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `company_id` on the `supplier` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `supplier` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `costPrice` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimunQuantity` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observation` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuantityInStock` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTimeEmptyStock` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletionStatus` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eValidationSattus` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "company_cnpj_key";

-- DropIndex
DROP INDEX "company_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "address";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "company";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "phone";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "status_company";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "subscription_plan";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "token_recovery";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_type";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "eTypeUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "eValitadionStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "eSalesStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ePaymentMethod" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "eTypeAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pre_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "totalPrice" DECIMAL NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "observation" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "supplier_fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplier_id" INTEGER NOT NULL,
    "fill_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subPrice" DECIMAL NOT NULL,
    "costPrice" DECIMAL NOT NULL,
    CONSTRAINT "supplier_fill_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "supplier_fill_fill_id_fkey" FOREIGN KEY ("fill_id") REFERENCES "fill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateTime" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "paymentMade" BOOLEAN NOT NULL,
    "eSalesStatus" INTEGER NOT NULL,
    "ePaymentMethod" INTEGER NOT NULL,
    CONSTRAINT "sales_eSalesStatus_fkey" FOREIGN KEY ("eSalesStatus") REFERENCES "eSalesStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sales_ePaymentMethod_fkey" FOREIGN KEY ("ePaymentMethod") REFERENCES "ePaymentMethod" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "sales_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    CONSTRAINT "product_sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_sales_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "sales" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "log_sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sales_id" INTEGER NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ePaymentMethod" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "log_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "product_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eTypeAction" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "log_fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "observation" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_name" TEXT NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "subTotal" DECIMAL NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "costPrice" DECIMAL NOT NULL,
    "minimunQuantity" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "totalQuantityInStock" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_product" ("category_id", "id", "name", "price") SELECT "category_id", "id", "name", "price" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
CREATE TABLE "new_category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_category" ("id", "name") SELECT "id", "name" FROM "category";
DROP TABLE "category";
ALTER TABLE "new_category" RENAME TO "category";
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "user_type" INTEGER NOT NULL,
    CONSTRAINT "user_user_type_fkey" FOREIGN KEY ("user_type") REFERENCES "eTypeUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user" ("createdAt", "email", "id", "name", "updateAt") SELECT "createdAt", "email", "id", "name", "updateAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE TABLE "new_batch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expirationDate" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "deletionStatus" BOOLEAN NOT NULL,
    "dateTimeEmptyStock" DATETIME NOT NULL,
    "product_id" INTEGER NOT NULL,
    "eValidationSattus" INTEGER NOT NULL,
    CONSTRAINT "batch_eValidationSattus_fkey" FOREIGN KEY ("eValidationSattus") REFERENCES "eValitadionStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_batch" ("id", "product_id", "quantity") SELECT "id", "product_id", "quantity" FROM "batch";
DROP TABLE "batch";
ALTER TABLE "new_batch" RENAME TO "batch";
CREATE TABLE "new_supplier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_supplier" ("email", "id", "name") SELECT "email", "id", "name" FROM "supplier";
DROP TABLE "supplier";
ALTER TABLE "new_supplier" RENAME TO "supplier";
CREATE UNIQUE INDEX "supplier_name_key" ON "supplier"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "pre_user_email_key" ON "pre_user"("email");
