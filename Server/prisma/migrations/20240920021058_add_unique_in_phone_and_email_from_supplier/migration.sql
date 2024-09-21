/*
  Warnings:

  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier_fill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `eTypeAction` on the `log_product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `supplier_id` to the `fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `fill` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "supplier_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "supplier";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "supplier_fill";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Batch_Fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "batch_id" INTEGER NOT NULL,
    "fill_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DECIMAL NOT NULL,
    "subTotal" DECIMAL NOT NULL,
    CONSTRAINT "Batch_Fill_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Batch_Fill_fill_id_fkey" FOREIGN KEY ("fill_id") REFERENCES "fill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_fill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "totalPrice" DECIMAL NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "observation" TEXT NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "fill_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_fill" ("dateTime", "id", "observation", "totalPrice") SELECT "dateTime", "id", "observation", "totalPrice" FROM "fill";
DROP TABLE "fill";
ALTER TABLE "new_fill" RENAME TO "fill";
CREATE TABLE "new_log_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "product_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eTypeAction" INTEGER NOT NULL
);
INSERT INTO "new_log_product" ("dateTime", "eTypeAction", "id", "product_id", "product_name", "quantity", "user_name") SELECT "dateTime", "eTypeAction", "id", "product_id", "product_name", "quantity", "user_name" FROM "log_product";
DROP TABLE "log_product";
ALTER TABLE "new_log_product" RENAME TO "log_product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_phone_key" ON "suppliers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");
